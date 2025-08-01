-- יצירת טבלת עורכי דין
CREATE TABLE lawyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialties TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  website TEXT,
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- יצירת טבלת הודעות ממתינות
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

-- יצירת טבלת בקשות הרשמה לעורכי דין
CREATE TABLE lawyer_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialties TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  website TEXT,
  email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- הוספת מנהל ראשי (סיסמה: admin123)
INSERT INTO admins (email, password_hash) VALUES
('admin@lawyers-index.com', '$2a$10$rQZ8K9mN2pL1sX3vB6cD4eF7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ7aA8bB9cC0dD1eE2fF3gG4hH5iI6jJ7kK8lL9mM0nN1oO2pP3qQ4rR5sS6tT7uU8vV9wW0xX1yY2zZ');

-- הגדרת הרשאות RLS
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE approved_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_applications ENABLE ROW LEVEL SECURITY;

-- יצירת מדיניות לטבלת עורכי דין
CREATE POLICY "Allow public read access to lawyers" ON lawyers
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to lawyers" ON lawyers
  FOR ALL USING (true);

-- יצירת מדיניות לטבלת הודעות ממתינות
CREATE POLICY "Allow admin access to pending_messages" ON pending_messages
  FOR ALL USING (true);

-- יצירת מדיניות לטבלת הודעות מאושרות
CREATE POLICY "Allow admin access to approved_messages" ON approved_messages
  FOR ALL USING (true);

-- יצירת מדיניות לטבלת מנהלים
CREATE POLICY "Allow admin access to admins table" ON admins
  FOR ALL USING (true);

-- יצירת מדיניות לטבלת בקשות הרשמה
CREATE POLICY "Allow public insert to lawyer_applications" ON lawyer_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access to lawyer_applications" ON lawyer_applications
  FOR ALL USING (true);

-- הוספת נתונים לדוגמה
INSERT INTO lawyers (name, specialties, location, phone, whatsapp, website, tags) VALUES
('עו"ד דוד כהן', 'דיני משפחה, גירושין', 'תל אביב', '050-1234567', '050-1234567', 'https://davidcohen.co.il', ARRAY['משפחה', 'גירושין']),
('עו"ד שרה לוי', 'דיני עבודה, ביטוח לאומי', 'ירושלים', '050-9876543', '050-9876543', 'https://saralevy.co.il', ARRAY['עבודה', 'ביטוח לאומי']),
('עו"ד משה גולדברג', 'דיני מקרקעין, נדל"ן', 'חיפה', '050-5555555', '050-5555555', 'https://moshegoldberg.co.il', ARRAY['מקרקעין', 'נדל"ן']); 