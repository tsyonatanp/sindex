-- בדיקת מבנה טבלת עורכי דין
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'lawyers'
ORDER BY ordinal_position;

-- בדיקת נתונים בטבלת עורכי דין
SELECT * FROM lawyers ORDER BY created_at DESC;

-- בדיקת מדיניות RLS לטבלת עורכי דין
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'lawyers'; 