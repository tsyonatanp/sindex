import { createClient } from '@supabase/supabase-js'

// בדיקה אם אנחנו בסביבת פיתוח ללא Supabase
const isDevelopment = process.env.NODE_ENV === 'development'
const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null

if (hasSupabaseConfig) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // יצירת mock client לבדיקה מקומית
  supabase = {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: null, error: { message: 'No Supabase config' } })
      }),
      insert: () => Promise.resolve({ error: { message: 'No Supabase config' } }),
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: 'No Supabase config' } })
      })
    })
  }
}

export { supabase }

// Types for our database
export interface Lawyer {
  id: string
  name: string
  specialties: string
  location: string
  phone: string
  whatsapp: string
  website?: string
  image_url?: string
  tags?: string[]
}

export interface PendingMessage {
  id: string
  phone: string
  message: string
  created_at: string
}

export interface ApprovedMessage {
  id: string
  phone: string
  message: string
  created_at: string
} 