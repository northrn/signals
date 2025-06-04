'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import PostCard from './PostCard'
import type { User } from '@supabase/supabase-js'

interface PostWithProfile {
  id: string
  title: string
  content: string
  url?: string
  user_id: string
  created_at: string
  vote_count: number
  comment_count: number
  profiles: {
    username: string
  }
  user_vote?: number
}

export default function PostFeed() {
  const [posts, setPosts] = useState<PostWithProfile[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [user])

  const fetchPosts = async () => {
    try {
      const query = supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      const { data: postsData, error: postsError } = await query

      if (postsError) throw postsError

      // Get user votes if logged in
      let postsWithVotes = postsData
      if (user) {
        const postIds = postsData.map(post => post.id)
        const { data: votesData } = await supabase
          .from('votes')
          .select('post_id, value')
          .eq('user_id', user.id)
          .in('post_id', postIds)

        const voteMap = new Map(votesData?.map(vote => [vote.post_id, vote.value]) || [])
        
        postsWithVotes = postsData.map(post => ({
          ...post,
          user_vote: voteMap.get(post.id) || 0
        }))
      }

      setPosts(postsWithVotes)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No posts yet. Be the first to share something!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          currentUserId={user?.id}
        />
      ))}
    </div>
  )
}