import { createClient } from '@supabase/supabase-js'

// בדיקה אם יש לנו משתני סביבה תקינים
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    // יצירת mock client במקרה של שגיאה
    supabase = createMockClient()
  }
} else {
  console.warn('No Supabase configuration found, using mock client')
  supabase = createMockClient()
}

function createMockClient() {
  return {
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