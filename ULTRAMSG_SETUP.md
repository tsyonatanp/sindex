# 📱 הגדרת Ultramsg לקבלת הודעות WhatsApp

## שלב 1: הרשמה ל-Ultramsg

1. היכנס ל-[Ultramsg](https://ultramsg.com)
2. לחץ על "Sign Up" והירשם עם האימייל שלך
3. אשר את האימייל שלך

## שלב 2: יצירת אינסטנס חדש

1. לאחר ההתחברות, לחץ על "Create Instance"
2. בחר "WhatsApp Business API"
3. תן שם לאינסטנס (למשל: "Lawyers Index")
4. לחץ על "Create"

## שלב 3: חיבור WhatsApp

1. פתח את WhatsApp במכשיר שלך
2. סרוק את ה-QR Code שמופיע במסך
3. המתן לחיבור (יכול לקחת כמה דקות)

## שלב 4: הגדרת Webhook

1. בממשק Ultramsg, לך ל-"Settings" > "Webhook"
2. הגדר את ה-URL הבא:
   ```
   https://your-domain.com/api/ultramsg-hook
   ```
3. בחר "POST" כמתודת HTTP
4. שמור את ההגדרות

## שלב 5: קבלת הטוקן

1. לך ל-"Settings" > "API"
2. העתק את ה-Token
3. הוסף אותו לקובץ `.env.local`:
   ```
   ULTRAMSG_TOKEN=your_token_here
   ```

## שלב 6: בדיקת החיבור

1. שלח הודעה ל-WhatsApp שלך
2. בדוק בממשק Ultramsg שההודעה התקבלה
3. בדוק באתר שלך שההודעה נשמרה בטבלת `pending_messages`

## פתרון בעיות נפוצות

### ההודעות לא מתקבלות באתר
- בדוק שה-URL של ה-Webhook נכון
- ודא שהאתר זמין ברשת
- בדוק את הלוגים ב-Vercel

### QR Code לא עובד
- ודא שהמכשיר מחובר לאינטרנט
- נסה לסרוק שוב
- בדוק שהמספר לא מחובר לחשבון אחר

### הודעות לא נשמרות ב-Supabase
- בדוק את משתני הסביבה
- ודא שהטבלאות נוצרו נכון
- בדוק את הרשאות ה-RLS

## תמיכה

לבעיות נוספות, פנה לתמיכה של Ultramsg או בדוק את הלוגים בממשק שלהם. 