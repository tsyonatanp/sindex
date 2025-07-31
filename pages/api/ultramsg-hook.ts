import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { message, from } = req.body

    // Validate required fields
    if (!message || !from) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Clean phone number (remove + if present)
    const cleanPhone = from.replace('+', '')

    // Insert message into pending_messages table
    const { error } = await supabase
      .from('pending_messages')
      .insert([
        {
          phone: cleanPhone,
          message: message,
        }
      ])

    if (error) {
      console.error('Error inserting message:', error)
      return res.status(500).json({ message: 'Error saving message' })
    }

    console.log('Message saved successfully:', { phone: cleanPhone, message })

    return res.status(200).json({ message: 'Message received successfully' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 