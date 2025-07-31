# 🚀 פריסה ל-Vercel

## שלב 1: הכנת הפרויקט

1. ודא שכל הקבצים נשמרו
2. צור repository ב-GitHub
3. העלה את הפרויקט ל-GitHub

## שלב 2: יצירת פרויקט ב-Vercel

1. היכנס ל-[Vercel](https://vercel.com)
2. לחץ על "New Project"
3. בחר את ה-repository שלך
4. לחץ על "Import"

## שלב 3: הגדרת משתני סביבה

ב-Vercel, לך ל-"Settings" > "Environment Variables" והוסף:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
ULTRAMSG_TOKEN=your_ultramsg_token
```

## שלב 4: הגדרת Domain

1. לך ל-"Settings" > "Domains"
2. הוסף domain מותאם אישית
3. עקוב אחר ההוראות להגדרת DNS

## שלב 5: בדיקת הפריסה

1. בדוק שהאתר עובד ב: `https://your-domain.com`
2. בדוק שהממשק ניהול עובד ב: `https://your-domain.com/admin`
3. בדוק שההודעות מתקבלות ב: `https://your-domain.com/messages`

## שלב 6: הגדרת Ultramsg Webhook

עדכן את ה-Webhook URL ב-Ultramsg ל:
```
https://your-domain.com/api/ultramsg-hook
```

## פתרון בעיות נפוצות

### האתר לא נטען
- בדוק שה-build הצליח ב-Vercel
- בדוק את משתני הסביבה
- בדוק את הלוגים ב-Vercel

### חיבור ל-Supabase לא עובד
- ודא שה-URL וה-Key נכונים
- בדוק שהטבלאות נוצרו
- בדוק את הרשאות ה-RLS

### הודעות WhatsApp לא מתקבלות
- בדוק שה-Webhook URL נכון
- ודא שה-domain זמין
- בדוק את הלוגים ב-Vercel Functions

## תמיכה

לבעיות נוספות, בדוק את:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Ultramsg Documentation](https://ultramsg.com/docs) 