import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, specialties, location, phone, whatsapp, website, email } = req.body

    // בדיקת שדות חובה
    if (!name || !specialties || !location || !phone) {
      return res.status(400).json({ error: 'שדות השם, התמחויות, מיקום וטלפון הם חובה' })
    }

    // הכנסת הבקשה לטבלה
    const { data, error } = await supabase
      .from('lawyer_applications')
      .insert([{
        name,
        specialties,
        location,
        phone,
        whatsapp: whatsapp || null,
        website: website || null,
        email: email || null,
        status: 'pending'
      }])

    if (error) {
      console.error('Error inserting application:', error)
      return res.status(500).json({ error: 'שגיאה בשמירת הבקשה' })
    }

    res.status(200).json({ 
      success: true, 
      message: 'הבקשה נשלחה בהצלחה למנהל לאישור' 
    })

  } catch (error) {
    console.error('Register lawyer error:', error)
    res.status(500).json({ error: 'שגיאה פנימית בשרת' })
  }
} 