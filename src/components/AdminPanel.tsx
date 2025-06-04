'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import type { User } from '@supabase/supabase-js'

interface PendingPost {
  id: string
  title: string
  content?: string
  url?: string
  user_id: string
  status: string
  created_at: string
  profiles: {
    username: string
  }
}

interface AdminPanelProps {
  user: User | null
}

export default function AdminPanel({ user }: AdminPanelProps) {
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processingPostId, setProcessingPostId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      checkAdminStatus()
    } else {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (isAdmin) {
      fetchPendingPosts()
    }
  }, [isAdmin])

  const checkAdminStatus = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setIsAdmin(data?.is_admin || false)
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error

      setPendingPosts(data || [])
    } catch (error) {
      console.error('Error fetching pending posts:', error)
    }
  }

  const handlePostAction = async (postId: string, action: 'approved' | 'rejected') => {
    if (!user) return

    setProcessingPostId(postId)

    try {
      const updateData = {
        status: action,
        approved_by: user.id,
        approved_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId)

      if (error) throw error

      // Remove the post from pending list
      setPendingPosts(prev => prev.filter(post => post.id !== postId))

      // Show success message
      const actionText = action === 'approved' ? 'approved' : 'rejected'
      alert(`Post ${actionText} successfully!`)
    } catch (error) {
      console.error(`Error ${action} post:`, error)
      alert(`Error ${action} post. Please try again.`)
    } finally {
      setProcessingPostId(null)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pendingPosts.length} post{pendingPosts.length !== 1 ? 's' : ''} pending review
          </p>
        </div>
      </div>

      {pendingPosts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400">No posts pending review at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingPosts.map((post) => (
            <div key={post.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {post.profiles.username.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {post.profiles.username}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {formatTimeAgo(post.created_at)}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded-full">
                  Pending
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h3>

              {post.content && (
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {post.content}
                </p>
              )}

              {post.url && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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

              <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => handlePostAction(post.id, 'approved')}
                  disabled={processingPostId === post.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {processingPostId === post.id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handlePostAction(post.id, 'rejected')}
                  disabled={processingPostId === post.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {processingPostId === post.id ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 