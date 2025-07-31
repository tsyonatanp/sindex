import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'סיסמה נוכחית וסיסמה חדשה נדרשות' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'הסיסמה החדשה חייבת להיות לפחות 6 תווים' })
    }

    // בדיקת הסיסמה הנוכחית
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', 'admin@lawyers-index.com')
      .single()

    if (error || !admin) {
      return res.status(401).json({ error: 'מנהל לא נמצא' })
    }

    // בדיקת הסיסמה הנוכחית
    const isValidCurrentPassword = await bcrypt.compare(currentPassword, admin.password_hash)

    if (!isValidCurrentPassword) {
      return res.status(401).json({ error: 'הסיסמה הנוכחית שגויה' })
    }

    // הצפנת הסיסמה החדשה
    const saltRounds = 10
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

    // עדכון הסיסמה ב-Supabase
    const { error: updateError } = await supabase
      .from('admins')
      .update({ password_hash: newPasswordHash })
      .eq('email', 'admin@lawyers-index.com')

    if (updateError) {
      console.error('Error updating password:', updateError)
      return res.status(500).json({ error: 'שגיאה בעדכון הסיסמה' })
    }

    // החזרת תגובה מוצלחת
    res.status(200).json({
      success: true,
      message: 'הסיסמה שונתה בהצלחה'
    })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'שגיאה פנימית בשרת' })
  }
} 