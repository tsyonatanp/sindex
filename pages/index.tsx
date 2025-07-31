import { useState, useEffect } from 'react'
import Head from 'next/head'
import LawyerCard from '@/components/LawyerCard'
import { supabase, Lawyer } from '@/lib/supabaseClient'

// נתוני דוגמה לעורכי דין
const demoLawyers: Lawyer[] = [
  {
    id: '1',
    name: 'עו״ד מריאטה פנחסי',
    specialties: 'ליקויי בניה, צוואות',
    location: 'בקעת אונו',
    phone: '054-4450244',
    whatsapp: '972544450244',
    website: 'https://example.com',
    tags: ['מומלץ', 'מהיר']
  },
  {
    id: '2',
    name: 'עו״ד דוד כהן',
    specialties: 'דיני עבודה, ביטוח לאומי',
    location: 'תל אביב',
    phone: '050-1234567',
    whatsapp: '972501234567',
    website: 'https://david-lawyer.co.il',
    tags: ['מומחה']
  },
  {
    id: '3',
    name: 'עו״ד שרה לוי',
    specialties: 'דיני משפחה, גירושין',
    location: 'ירושלים',
    phone: '052-9876543',
    whatsapp: '972529876543',
    tags: ['מנוסה']
  },
  {
    id: '4',
    name: 'עו״ד משה גולדברג',
    specialties: 'דיני חברות, מיזוגים ורכישות',
    location: 'חיפה',
    phone: '053-5551234',
    whatsapp: '972535551234',
    website: 'https://goldberg-law.co.il',
    tags: ['מומחה', 'מומלץ']
  },
  {
    id: '5',
    name: 'עו״ד רותי כהן',
    specialties: 'דיני נזיקין, תאונות דרכים',
    location: 'באר שבע',
    phone: '054-7778889',
    whatsapp: '972547778889',
    tags: ['מנוסה']
  }
]

export default function Home() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [locations, setLocations] = useState<string[]>([])

  useEffect(() => {
    fetchLawyers()
  }, [])

  const fetchLawyers = async () => {
    try {
      // נסה לקבל נתונים מ-Supabase
      const { data, error } = await supabase
        .from('lawyers')
        .select('*')
        .order('name')

      if (error) {
        console.log('Using demo data due to Supabase error:', error.message)
        // אם יש שגיאה, השתמש בנתוני הדוגמה
        setLawyers(demoLawyers)
        const uniqueLocations = Array.from(new Set(demoLawyers.map((lawyer: any) => lawyer.location))) as string[]
        setLocations(uniqueLocations)
      } else {
        setLawyers(data || demoLawyers)
        const uniqueLocations = Array.from(new Set((data || demoLawyers).map((lawyer: any) => lawyer.location))) as string[]
        setLocations(uniqueLocations)
      }
    } catch (error) {
      console.log('Using demo data due to error:', error)
      // במקרה של שגיאה, השתמש בנתוני הדוגמה
      setLawyers(demoLawyers)
      const uniqueLocations = Array.from(new Set(demoLawyers.map((lawyer: any) => lawyer.location))) as string[]
      setLocations(uniqueLocations)
    } finally {
      setLoading(false)
    }
  }

  const filteredLawyers = lawyers.filter((lawyer: any) => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.specialties.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !selectedLocation || lawyer.location === selectedLocation
    return matchesSearch && matchesLocation
  })

  return (
    <>
      <Head>
        <title>אינדקס עורכי דין</title>
        <meta name="description" content="אינדקס עורכי דין - מצא עורך דין מתאים" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                🏛️ אינדקס עורכי דין
              </h1>
              <nav className="flex gap-4">
                <a 
                  href="/messages" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  💬 פניות מהלקוחות
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 חיפוש
                </label>
                <input
                  type="text"
                  placeholder="חיפוש לפי שם או תחום התמחות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 אזור
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">כל האזורים</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">טוען עורכי דין...</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  נמצאו {filteredLawyers.length} עורכי דין
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLawyers.map((lawyer) => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} />
                ))}
              </div>

              {filteredLawyers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    לא נמצאו עורכי דין מתאימים לחיפוש שלך
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
} 