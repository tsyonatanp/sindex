import { useState, useEffect } from 'react'
import Head from 'next/head'
import { supabase, PendingMessage } from '@/lib/supabaseClient'

interface LawyerApplication {
  id: string
  name: string
  specialties: string
  location: string
  phone: string
  whatsapp?: string
  website?: string
  email?: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  created_at: string
}

export default function Admin() {
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([])
  const [lawyerApplications, setLawyerApplications] = useState<LawyerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'messages' | 'applications'>('messages')
  const [applicationStatusFilter, setApplicationStatusFilter] = useState<'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    // Check if already authenticated
    const adminSession = localStorage.getItem('admin_session')
    if (adminSession) {
      try {
        const admin = JSON.parse(adminSession)
        if (admin.id && admin.email) {
          setIsAuthenticated(true)
          fetchPendingMessages()
          fetchLawyerApplications()
        }
      } catch (error) {
        localStorage.removeItem('admin_session')
      }
    }
  }, [])

  const handleLogin = async () => {
    if (!email || !password) {
      alert('נא להזין אימייל וסיסמה')
      return
    }

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_session', JSON.stringify(data.admin))
        fetchPendingMessages()
      } else {
        alert(data.error || 'שגיאה בכניסה')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('שגיאה בכניסה')
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

  const fetchLawyerApplications = async () => {
    try {
      console.log('Fetching lawyer applications...')
      const { data, error } = await supabase
        .from('lawyer_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Lawyer applications data:', data)
      setLawyerApplications(data || [])
    } catch (error) {
      console.error('Error fetching lawyer applications:', error)
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

  const approveApplication = async (applicationId: string) => {
    setProcessing(applicationId)
    try {
      console.log('Approving application:', applicationId)
      const application = lawyerApplications.find(a => a.id === applicationId)
      if (!application) {
        console.error('Application not found:', applicationId)
        return
      }

      console.log('Application data:', application)

      // עדכון סטטוס לאושר
      console.log('Updating status to approved...')
      const { error: updateError } = await supabase
        .from('lawyer_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId)

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      console.log('Status updated successfully')

      // הוספה לטבלת עורכי דין
      console.log('Inserting into lawyers table...')
      const { error: insertError } = await supabase
        .from('lawyers')
        .insert([{
          name: application.name,
          specialties: application.specialties,
          location: application.location,
          phone: application.phone,
          whatsapp: application.whatsapp,
          website: application.website
        }])

      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }

      console.log('Lawyer added successfully')

      // Refresh the list
      fetchLawyerApplications()
    } catch (error) {
      console.error('Error approving application:', error)
      alert('שגיאה באישור הבקשה')
    } finally {
      setProcessing(null)
    }
  }

  const rejectApplication = async (applicationId: string) => {
    const notes = prompt('סיבת הדחייה (אופציונלי):')
    
    setProcessing(applicationId)
    try {
      const { error } = await supabase
        .from('lawyer_applications')
        .update({ 
          status: 'rejected',
          notes: notes || null
        })
        .eq('id', applicationId)

      if (error) throw error

      // Refresh the list
      fetchLawyerApplications()
    } catch (error) {
      console.error('Error rejecting application:', error)
      alert('שגיאה בדחיית הבקשה')
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
                  אימייל
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="הכנס אימייל"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סיסמה
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="הכנס סיסמה"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
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
                🔐 ניהול מערכת
              </h1>
              <nav className="flex gap-4">
                <a 
                  href="/" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  🏛️ חזרה לאינדקס
                </a>
                <a 
                  href="/change-password" 
                  className="text-yellow-600 hover:text-yellow-800 font-medium"
                >
                  🔑 שנה סיסמה
                </a>
                <button
                  onClick={() => {
                    setIsAuthenticated(false)
                    localStorage.removeItem('admin_session')
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
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📞 הודעות וואטסאפ ({pendingMessages.length})
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 בקשות הרשמה ({lawyerApplications.length})
              </button>
            </nav>
          </div>

          {/* Application Status Tabs */}
          {activeTab === 'applications' && (
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setApplicationStatusFilter('pending')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    applicationStatusFilter === 'pending'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ⏳ ממתינות ({lawyerApplications.filter(a => a.status === 'pending').length})
                </button>
                <button
                  onClick={() => setApplicationStatusFilter('approved')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    applicationStatusFilter === 'approved'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ✅ מאושרות ({lawyerApplications.filter(a => a.status === 'approved').length})
                </button>
                <button
                  onClick={() => setApplicationStatusFilter('rejected')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    applicationStatusFilter === 'rejected'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ❌ נדחו ({lawyerApplications.filter(a => a.status === 'rejected').length})
                </button>
              </nav>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">טוען...</p>
            </div>
          ) : (
            <>
              {activeTab === 'messages' && (
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

              {activeTab === 'applications' && (
                <>
                  <div className="mb-6">
                    <p className="text-gray-600">
                      נמצאו {lawyerApplications.filter(a => a.status === applicationStatusFilter).length} בקשות הרשמה {applicationStatusFilter === 'pending' ? 'ממתינות' : applicationStatusFilter === 'approved' ? 'מאושרות' : 'נדחו'}
                    </p>
                    <p className="text-xs text-gray-500">
                      סה"כ בקשות: {lawyerApplications.length} | ממתינות: {lawyerApplications.filter(a => a.status === 'pending').length} | מאושרות: {lawyerApplications.filter(a => a.status === 'approved').length} | נדחו: {lawyerApplications.filter(a => a.status === 'rejected').length}
                    </p>
                  </div>

                  {lawyerApplications.filter(a => a.status === applicationStatusFilter).length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        אין בקשות הרשמה {applicationStatusFilter === 'pending' ? 'ממתינות' : applicationStatusFilter === 'approved' ? 'מאושרות' : 'נדחו'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lawyerApplications
                        .filter(a => a.status === applicationStatusFilter)
                        .map((application) => (
                        <div 
                          key={application.id} 
                          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {application.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                📍 {application.location}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">
                              📅 {formatDate(application.created_at)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">התמחויות:</p>
                              <p className="text-sm text-gray-600">{application.specialties}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">טלפון:</p>
                              <p className="text-sm text-gray-600">{application.phone}</p>
                            </div>
                            {application.whatsapp && (
                              <div>
                                <p className="text-sm font-medium text-gray-700">וואטסאפ:</p>
                                <p className="text-sm text-gray-600">{application.whatsapp}</p>
                              </div>
                            )}
                            {application.website && (
                              <div>
                                <p className="text-sm font-medium text-gray-700">אתר:</p>
                                <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                                  {application.website}
                                </a>
                              </div>
                            )}
                            {application.email && (
                              <div>
                                <p className="text-sm font-medium text-gray-700">אימייל:</p>
                                <p className="text-sm text-gray-600">{application.email}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3">
                            {application.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => approveApplication(application.id)}
                                  disabled={processing === application.id}
                                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                  {processing === application.id ? '⏳ מעבד...' : '✅ אישור'}
                                </button>
                                <button
                                  onClick={() => rejectApplication(application.id)}
                                  disabled={processing === application.id}
                                  className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                  {processing === application.id ? '⏳ מעבד...' : '❌ דחייה'}
                                </button>
                              </>
                            )}
                            {application.status === 'approved' && (
                              <span className="text-green-600 font-medium">✅ מאושר</span>
                            )}
                            {application.status === 'rejected' && (
                              <span className="text-red-600 font-medium">❌ נדחה</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
} 