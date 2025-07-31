import { useState, useEffect } from 'react'
import Head from 'next/head'
import { supabase, ApprovedMessage } from '@/lib/supabaseClient'

export default function Messages() {
  const [messages, setMessages] = useState<ApprovedMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('approved_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
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

  return (
    <>
      <Head>
        <title>פניות מהלקוחות - אינדקס עורכי דין</title>
        <meta name="description" content="פניות מאושרות מהלקוחות" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                💬 פניות מהלקוחות
              </h1>
              <nav className="flex gap-4">
                <a 
                  href="/" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  🏛️ חזרה לאינדקס
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">טוען הודעות...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  נמצאו {messages.length} הודעות מאושרות
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    אין הודעות מאושרות להצגה
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
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
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {message.message}
                        </p>
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