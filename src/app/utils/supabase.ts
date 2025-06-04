import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Post {
  id: string
  title: string
  content: string
  url?: string
  user_id: string
  created_at: string
  vote_count: number
  comment_count: number
}

export interface Vote {
  id: string
  post_id: string
  user_id: string
  value: number // 1 for upvote, -1 for downvote
  created_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  parent_id?: string
  created_at: string
}

export interface Profile {
  id: string
  username: string
  created_at: string
}