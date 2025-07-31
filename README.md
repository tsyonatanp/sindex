# 🏛️ אינדקס עורכי דין

אתר אינדקס עורכי דין עם קבלת פניות מ-WhatsApp, הצגתן באתר לאחר אישור מנהל, וכרטיסי עורכי דין מעוצבים.

## ✨ תכונות

- 📋 **אינדקס עורכי דין** - הצגת עורכי דין עם חיפוש וסינון
- 💬 **קבלת הודעות WhatsApp** - חיבור ל-Ultramsg לקבלת הודעות
- 🔐 **ממשק ניהול** - אישור או מחיקת הודעות נכנסות
- 📱 **עיצוב רספונסיבי** - מותאם למובייל ומחשב
- 🌐 **תמיכה ב-RTL** - עיצוב מותאם לעברית
- 🏷️ **תגיות עורכי דין** - תגיות כמו "מומלץ", "מהיר" וכו'

## 🚀 התקנה

### 1. התקנת תלויות

```bash
npm install
```

### 2. הגדרת משתני סביבה

צור קובץ `.env.local` והעתק את התוכן מ-`env.example`:

```bash
cp env.example .env.local
```

עדכן את המשתנים:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Admin Password
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password_here

# Ultramsg Configuration (Optional)
ULTRAMSG_TOKEN=your_ultramsg_token_here
```

### 3. הגדרת Supabase

1. צור פרויקט חדש ב-[Supabase](https://supabase.com)
2. צור את הטבלאות הבאות:

#### טבלה: `lawyers`
```sql
CREATE TABLE lawyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialties TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  website TEXT,
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### טבלה: `pending_messages`
```sql
CREATE TABLE pending_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### טבלה: `approved_messages`
```sql
CREATE TABLE approved_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. הוספת נתוני דוגמה

הוסף עורכי דין לדוגמה:

```sql
INSERT INTO lawyers (name, specialties, location, phone, whatsapp, website, tags) VALUES
('עו״ד מריאטה פנחסי', 'ליקויי בניה, צוואות', 'בקעת אונו', '054-4450244', '972544450244', 'https://example.com', ARRAY['מומלץ', 'מהיר']),
('עו״ד דוד כהן', 'דיני עבודה, ביטוח לאומי', 'תל אביב', '050-1234567', '972501234567', 'https://david-lawyer.co.il', ARRAY['מומחה']),
('עו״ד שרה לוי', 'דיני משפחה, גירושין', 'ירושלים', '052-9876543', '972529876543', NULL, ARRAY['מנוסה']);
```

## 🏃‍♂️ הפעלה

### פיתוח מקומי

```bash
npm run dev
```

האתר יהיה זמין ב: `http://localhost:3000`

### בנייה לפריסה

```bash
npm run build
npm start
```

## 📱 הגדרת WhatsApp

### חיבור ל-Ultramsg

1. הירשם ל-[Ultramsg](https://ultramsg.com)
2. צור אינסטנס חדש
3. הגדר Webhook URL ל: `https://your-domain.com/api/ultramsg-hook`
4. העתק את הטוקן ל-`.env.local`

## 🔐 גישה לממשק ניהול

גש ל: `https://your-domain.com/admin`

השתמש בסיסמה שהגדרת ב-`NEXT_PUBLIC_ADMIN_PASSWORD`

## 📁 מבנה הפרויקט

```
/
├── components/
│   └── LawyerCard.tsx          # רכיב כרטיס עורך דין
├── lib/
│   └── supabaseClient.ts       # חיבור ל-Supabase
├── pages/
│   ├── index.tsx               # דף הבית
│   ├── messages.tsx            # הצגת הודעות מאושרות
│   ├── admin.tsx               # ממשק ניהול
│   └── api/
│       └── ultramsg-hook.ts    # API לקבלת הודעות WhatsApp
├── styles/
│   └── globals.css             # עיצוב גלובלי
└── README.md
```

## 🎨 עיצוב

האתר משתמש ב:
- **Tailwind CSS** - לעיצוב מהיר ומודרני
- **RTL Support** - תמיכה מלאה בעברית
- **Responsive Design** - מותאם לכל המכשירים
- **Modern UI** - עיצוב נקי ומודרני

## 🔧 טכנולוגיות

- **Next.js** - React framework
- **TypeScript** - טיפוסים בטוחים
- **Supabase** - בסיס נתונים ואחסון
- **Tailwind CSS** - עיצוב
- **Ultramsg** - חיבור WhatsApp

## 📞 תמיכה

לשאלות ותמיכה, פנה אלינו דרך GitHub Issues.

## 📄 רישיון

MIT License 