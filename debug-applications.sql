-- בדיקת כל הבקשות וסטטוס שלהן
SELECT 
  id,
  name,
  status,
  created_at
FROM lawyer_applications 
ORDER BY created_at DESC;

-- בדיקת כמה יש מכל סטטוס
SELECT 
  status,
  COUNT(*) as count
FROM lawyer_applications 
GROUP BY status; 