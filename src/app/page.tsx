'use client'

import Header from '@/components/Header'
import PostFeed from '@/components/PostFeed'
import PostSubmissionForm from '@/components/PostSubmissionForm'
import { supabase } from '@/utils/supabase'
import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'

function HomeContent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Latest AI Developments
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with the latest in artificial intelligence and tools
        </p>
      </div>

      <div className="space-y-6">
        {/* Post Submission Form */}
        <PostSubmissionForm user={user} />
        
        {/* Post Feed - Approved Posts Only */}
        <PostFeed />
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <HomeContent />
    </div>
  )
}
