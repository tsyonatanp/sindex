import { useState } from 'react'
import { useRouter } from 'next/router'

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    // בדיקות תקינות
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('כל השדות נדרשים')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('הסיסמה החדשה לא תואמת')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('הסיסמה החדשה חייבת להיות לפחות 6 תווים')
      setLoading(false)
      return
    }

    try {
      // קבלת המייל של המשתמש המחובר
      const adminSession = localStorage.getItem('admin_session')
      const sessionData = adminSession ? JSON.parse(adminSession) : null
      const userEmail = sessionData?.admin?.email || '1'

      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          email: userEmail,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('הסיסמה שונתה בהצלחה!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(data.error || 'שגיאה בשינוי הסיסמה')
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          שינוי סיסמה
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          הזן את הסיסמה הנוכחית והסיסמה החדשה
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* סיסמה נוכחית */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                סיסמה נוכחית
              </label>
              <div className="mt-1 relative">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? '🔒' : '👁️'}
                </button>
              </div>
            </div>

            {/* סיסמה חדשה */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                סיסמה חדשה
              </label>
              <div className="mt-1 relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? '🔒' : '👁️'}
                </button>
              </div>
            </div>

            {/* אישור סיסמה חדשה */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                אישור סיסמה חדשה
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🔒' : '👁️'}
                </button>
              </div>
            </div>

            {/* הודעות */}
            {message && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{message}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* כפתורים */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                חזרה למנהל
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'משנה סיסמה...' : 'שנה סיסמה'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 