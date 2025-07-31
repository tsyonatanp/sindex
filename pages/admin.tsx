import { useState, useEffect } from 'react'
import Head from 'next/head'
import { supabase, PendingMessage } from '@/lib/supabaseClient'

export default function Admin() {
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    // Check if already authenticated
    const savedPassword = localStorage.getItem('admin_password')
    if (savedPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      fetchPendingMessages()
    }
  }, [])

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_password', password)
      fetchPendingMessages()
    } else {
      alert('סיסמה שגויה')
    }
  }

  const fetchPendingMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setPendingMessages(data || [])
    } catch (error) {
      console.error('Error fetching pending messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveMessage = async (messageId: string) => {
    setProcessing(messageId)
    try {
      const message = pendingMessages.find(m => m.id === messageId)
      if (!message) return

      // Insert into approved_messages
      const { error: insertError } = await supabase
        .from('approved_messages')
        .insert([message])

      if (insertError) throw insertError

      // Delete from pending_messages
      const { error: deleteError } = await supabase
        .from('pending_messages')
        .delete()
        .eq('id', messageId)

      if (deleteError) throw deleteError

      // Refresh the list
      fetchPendingMessages()
    } catch (error) {
      console.error('Error approving message:', error)
      alert('שגיאה באישור ההודעה')
    } finally {
      setProcessing(null)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק הודעה זו?')) return

    setProcessing(messageId)
    try {
      const { error } = await supabase
        .from('pending_messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error

      // Refresh the list
      fetchPendingMessages()
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('שגיאה במחיקת ההודעה')
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const maskPhone = (phone: string) => {
    if (phone.length <= 4) return phone
    return phone.slice(0, -4) + '****'
  }

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>ניהול - אינדקס עורכי דין</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🔐 כניסה לניהול
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סיסמה
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="הכנס סיסמה"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                כניסה
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>ניהול - אינדקס עורכי דין</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                🔐 ניהול הודעות
              </h1>
              <nav className="flex gap-4">
                <a 
                  href="/" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  🏛️ חזרה לאינדקס
                </a>
                <button
                  onClick={() => {
                    setIsAuthenticated(false)
                    localStorage.removeItem('admin_password')
                  }}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  🚪 יציאה
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">טוען הודעות ממתינות...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  נמצאו {pendingMessages.length} הודעות ממתינות לאישור
                </p>
              </div>

              {pendingMessages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    אין הודעות ממתינות לאישור
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            📱 {maskPhone(message.phone)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          📅 {formatDate(message.created_at)}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => approveMessage(message.id)}
                          disabled={processing === message.id}
                          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          {processing === message.id ? '⏳ מעבד...' : '✅ אישור'}
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          disabled={processing === message.id}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          {processing === message.id ? '⏳ מעבד...' : '❌ מחיקה'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
} 