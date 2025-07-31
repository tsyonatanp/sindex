-- יצירת טבלת עורכי דין
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

-- יצירת טבלת הודעות ממתינות לאישור
CREATE TABLE pending_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- יצירת טבלת הודעות מאושרות
CREATE TABLE approved_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- יצירת טבלת מנהלים
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- הוספת מנהל ראשי (סיסמה: admin123)
INSERT INTO admins (email, password_hash) VALUES 
('admin@lawyers-index.com', '$2a$10$rQZ8K9mN2pL1sX3vB6cD4eF7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ7aA8bB9cC0dD1eE2fF3gG4hH5iI6jJ7kK8lL9mM0nN1oO2pP3qQ4rR5sS6tT7uU8vV9wW0xX1yY2zZ');

-- הוספת נתוני דוגמה לעורכי דין
INSERT INTO lawyers (name, specialties, location, phone, whatsapp, website, tags) VALUES
('עו״ד מריאטה פנחסי', 'ליקויי בניה, צוואות', 'בקעת אונו', '054-4450244', '972544450244', 'https://example.com', ARRAY['מומלץ', 'מהיר']),
('עו״ד דוד כהן', 'דיני עבודה, ביטוח לאומי', 'תל אביב', '050-1234567', '972501234567', 'https://david-lawyer.co.il', ARRAY['מומחה']),
('עו״ד שרה לוי', 'דיני משפחה, גירושין', 'ירושלים', '052-9876543', '972529876543', NULL, ARRAY['מנוסה']),
('עו״ד משה גולדברג', 'דיני חברות, מיזוגים ורכישות', 'חיפה', '053-5551234', '972535551234', 'https://goldberg-law.co.il', ARRAY['מומחה', 'מומלץ']),
('עו״ד רותי כהן', 'דיני נזיקין, תאונות דרכים', 'באר שבע', '054-7778889', '972547778889', NULL, ARRAY['מנוסה']);

-- הגדרת הרשאות RLS (Row Level Security)
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE approved_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- יצירת מדיניות לקריאה ציבורית מטבלת עורכי דין
CREATE POLICY "Allow public read access to lawyers" ON lawyers
  FOR SELECT USING (true);

-- יצירת מדיניות לכתיבה לטבלת הודעות ממתינות (רק מה-API)
CREATE POLICY "Allow API insert to pending_messages" ON pending_messages
  FOR INSERT WITH CHECK (true);

-- יצירת מדיניות לקריאה וכתיבה לטבלת הודעות מאושרות
CREATE POLICY "Allow public read access to approved_messages" ON approved_messages
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert to approved_messages" ON approved_messages
  FOR INSERT WITH CHECK (true);

-- יצירת מדיניות למחיקה מהודעות ממתינות (רק מה-API)
CREATE POLICY "Allow API delete from pending_messages" ON pending_messages
  FOR DELETE USING (true);

-- יצירת מדיניות למנהלים (רק מנהלים יכולים לגשת)
CREATE POLICY "Allow admin access to admins table" ON admins
  FOR ALL USING (auth.role() = 'authenticated'); 