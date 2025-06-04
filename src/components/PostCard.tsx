'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'

interface Post {
  id: string
  title: string
  content?: string
  url?: string
  user_id: string
  created_at: string
  vote_count: number
  comment_count: number
}

interface PostCardProps {
  post: Post & {
    profiles: {
      username: string
    }
    user_vote?: number
  }
  currentUserId?: string
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [voteCount, setVoteCount] = useState<number>(post.vote_count)
  const [userVote, setUserVote] = useState(post.user_vote || 0)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (value: number) => {
    if (!currentUserId || isVoting) return
    
    setIsVoting(true)
    
    try {
      if (userVote === value) {
        // Remove vote
        await supabase
          .from('votes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId)
        
        setVoteCount((prev: number) => prev - value)
        setUserVote(0)
      } else {
        // Add or update vote
        await supabase
          .from('votes')
          .upsert({
            post_id: post.id,
            user_id: currentUserId,
            value
          })
        
        setVoteCount((prev: number) => prev - userVote + value)
        setUserVote(value)
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
    
    setIsVoting(false)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d`
    
    return date.toLocaleDateString()
  }

  // Generate consistent avatar color based on username
  const getAvatarColor = (username: string) => {
    const colors = [
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-green-500 to-teal-500',
      'bg-gradient-to-br from-orange-500 to-red-500',
      'bg-gradient-to-br from-indigo-500 to-purple-500',
      'bg-gradient-to-br from-pink-500 to-rose-500',
      'bg-gradient-to-br from-cyan-500 to-blue-500',
      'bg-gradient-to-br from-teal-500 to-green-500',
    ]
    const index = username.charCodeAt(0) % colors.length
    return colors[index]
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header with user info */}
      <div className="flex items-start gap-3 mb-4">
        {/* User Avatar */}
        <div className={`w-12 h-12 rounded-full ${getAvatarColor(post.profiles.username)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
          {getInitials(post.profiles.username)}
        </div>
        
        {/* User info and timestamp */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
              {post.profiles.username}
            </h4>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              @{post.profiles.username.toLowerCase()}
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              ·
            </span>
            <time className="text-gray-500 dark:text-gray-400 text-sm">
              {formatTimeAgo(post.created_at)}
            </time>
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
          {post.url ? (
            <a 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {post.title}
            </a>
          ) : (
            post.title
          )}
        </h2>
        
        {post.content && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {post.content}
          </p>
        )}

        {/* URL preview for external links */}
        {post.url && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <a 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline break-all"
            >
              {post.url}
            </a>
          </div>
        )}
      </div>

      {/* Engagement bar */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        {/* Vote buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote(1)}
            disabled={!currentUserId || isVoting}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              userVote === 1 
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500'
            } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {voteCount > 0 && <span>{voteCount}</span>}
          </button>
          
          <button
            onClick={() => handleVote(-1)}
            disabled={!currentUserId || isVoting}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              userVote === -1 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500'
            } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Comments */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{post.comment_count}</span>
        </button>

        {/* Share button */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
      </div>
    </article>
  )
}