import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { currentPassword, newPassword, email } = req.body

    if (!currentPassword || !newPassword || !email) {
      return res.status(400).json({ error: 'סיסמה נוכחית, סיסמה חדשה ואימייל נדרשים' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'הסיסמה החדשה חייבת להיות לפחות 6 תווים' })
    }

    // בדיקת הסיסמה הנוכחית עבור המשתמש המחובר
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !admin) {
      return res.status(401).json({ error: 'מנהל לא נמצא' })
    }

    const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'הסיסמה הנוכחית שגויה' })
    }

    // הצפנת הסיסמה החדשה
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // עדכון הסיסמה ב-Supabase עבור המשתמש המחובר
    const { error: updateError } = await supabase
      .from('admins')
      .update({ password_hash: hashedNewPassword })
      .eq('id', admin.id)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return res.status(500).json({ error: 'שגיאה בעדכון הסיסמה' })
    }

    res.status(200).json({ success: true, message: 'הסיסמה שונתה בהצלחה!' })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'שגיאה פנימית בשרת' })
  }
} 