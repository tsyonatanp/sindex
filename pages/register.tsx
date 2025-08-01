import { useState } from 'react'
import Head from 'next/head'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    specialties: '',
    location: '',
    phone: '',
    whatsapp: '',
    website: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    // בדיקת שדות חובה
    if (!formData.name || !formData.specialties || !formData.location || !formData.phone) {
      setError('שדות השם, התמחויות, מיקום וטלפון הם חובה')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/register-lawyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('תודה! הבקשה שלך נשלחה למנהל לאישור. נחזור אליך בקרוב.')
        setFormData({
          name: '',
          specialties: '',
          location: '',
          phone: '',
          whatsapp: '',
          website: '',
          email: ''
        })
      } else {
        setError(data.error || 'שגיאה בשליחת הבקשה')
      }
    } catch (err) {
      console.error('Error submitting application:', err)
      setError('שגיאה פנימית בשרת')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <Head>
        <title>הרשמה לאינדקס עורכי דין</title>
        <meta name="description" content="הוסף את עצמך לאינדקס עורכי דין" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              📝 הרשמה לאינדקס עורכי דין
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              מלא את הפרטים שלך ונשלח למנהל לאישור
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
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

              {/* שם מלא */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  שם מלא *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="עו״ד דוד כהן"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* התמחויות */}
              <div>
                <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">
                  התמחויות *
                </label>
                <textarea
                  id="specialties"
                  name="specialties"
                  required
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="דיני משפחה, גירושין, דיני עבודה"
                  value={formData.specialties}
                  onChange={handleInputChange}
                />
              </div>

              {/* מיקום */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  מיקום *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="תל אביב, ירושלים"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              {/* טלפון */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  טלפון *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="050-1234567"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              {/* וואטסאפ */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                  וואטסאפ (אופציונלי)
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="050-1234567"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                />
              </div>

              {/* אתר */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  אתר (אופציונלי)
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://example.co.il"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>

              {/* אימייל */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  אימייל (אופציונלי)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="lawyer@example.co.il"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'שולח...' : 'שלח בקשה'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                חזרה לדף הראשי
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 