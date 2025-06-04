'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import type { Session, AuthError } from '@supabase/supabase-js'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session) {
        router.push('/')
      }
    })
  }, [router])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        alert('Check your email for confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/')
      }
    } catch (error) {
      const authError = error as AuthError
      alert(authError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailContinue = () => {
    setShowPassword(true)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Signals
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isSignUp ? 'Create your account to get started.' : 'Log in to sync your content.'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="space-y-4">
          <form onSubmit={showPassword ? handleAuth : (e) => { e.preventDefault(); handleEmailContinue(); }} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            {showPassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : showPassword ? (isSignUp ? 'Sign Up' : 'Continue with email') : 'Continue with email'}
            </button>
          </form>

          {showPassword && (
            <div className="space-y-4">
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-500 hover:underline text-sm"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(false)}
                  className="text-gray-500 dark:text-gray-400 hover:underline text-sm"
                >
                  ← Back to email
                </button>
              </div>
            </div>
          )}

          {!showPassword && (
            <div className="text-center">
              <button className="text-gray-500 dark:text-gray-400 hover:underline text-sm">
                Forgot password?
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-2">
          <p>
            By clicking &quot;Continue with email&quot; above, you acknowledge that you have read and understood, and agree to Signals&apos; Terms & Conditions and Privacy Policy.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:underline">Need help?</a>
            <a href="#" className="hover:underline">Privacy & Terms</a>
          </div>
          <p>© 2024 Signals, Inc.</p>
        </div>
      </div>
    </div>
  )
}