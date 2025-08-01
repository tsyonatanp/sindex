-- בדיקה אם הטבלה קיימת
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'lawyer_applications'
);

-- בדיקה אם יש נתונים בטבלה
SELECT * FROM lawyer_applications ORDER BY created_at DESC;

-- בדיקה של כל הטבלאות במסד הנתונים
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name; 