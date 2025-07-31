import { Lawyer } from '@/lib/supabaseClient'

interface LawyerCardProps {
  lawyer: Lawyer
}

export default function LawyerCard({ lawyer }: LawyerCardProps) {
  const { name, specialties, location, phone, whatsapp, website, image_url, tags } = lawyer

  return (
    <div dir="rtl" className="bg-white shadow-md rounded-2xl p-4 w-full max-w-md mx-auto mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3">
        {image_url && (
          <img 
            src={image_url} 
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-1">⚖️ {name}</h2>
          <p className="text-sm text-gray-600 mb-1">תחומי התמחות: {specialties}</p>
          <p className="text-sm text-gray-600 mb-1">📍 אזור: {location}</p>
          <p className="text-sm text-gray-600 mb-3">☎️ {phone}</p>
          
          {tags && tags.length > 0 && (
            <div className="flex gap-1 mb-3 flex-wrap">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-start mt-4 gap-3 flex-wrap">
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-xl transition-colors"
        >
          💬 WhatsApp
        </a>
        <a
          href={`tel:${phone}`}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition-colors"
        >
          📞 התקשר
        </a>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-xl transition-colors"
          >
            🌐 לאתר
          </a>
        )}
      </div>
    </div>
  )
} 