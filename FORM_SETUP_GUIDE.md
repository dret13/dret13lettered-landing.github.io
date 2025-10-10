# Verification Form Setup Guide

This guide will help you set up the secure verification form with email notifications and optional database storage.

## 🔒 Security Features Implemented

1. **Honeypot Field** - Hidden field to catch bots
2. **Rate Limiting** - 5-minute cooldown between submissions (client & server-side)
3. **Input Sanitization** - Prevents XSS attacks
4. **Email Validation** - Both client and server-side
5. **File Upload Security** - Limits file types to images
6. **IP Tracking** - Logs submission source for security
7. **CORS Protection** - Configured for specific origins

## 📋 Prerequisites

- Node.js installed (v16 or higher)
- A Vercel account (free tier works)
- An email account for SMTP (Gmail, Outlook, etc.)

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
cd landing-page
npm install
```

### Step 2: Configure Email Settings

1. Create a `.env` file in the `landing-page` directory:
   ```bash
   cp env.template .env
   ```

2. Edit `.env` with your email settings:

**For Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NOTIFICATION_EMAIL=your-email@gmail.com
```

**Important for Gmail:**
- You MUST use an "App Password", not your regular password
- Go to: Google Account → Security → 2-Step Verification → App Passwords
- Generate a new app password for "Mail"
- Use that generated password in `SMTP_PASS`

**For Outlook/Hotmail:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
NOTIFICATION_EMAIL=your-email@outlook.com
```

### Step 3: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and test the form submission.

### Step 4: Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. **Important:** Add environment variables to Vercel:
   - Go to your project on Vercel Dashboard
   - Navigate to Settings → Environment Variables
   - Add all variables from your `.env` file:
     - `SMTP_HOST`
     - `SMTP_PORT`
     - `SMTP_USER`
     - `SMTP_PASS`
     - `NOTIFICATION_EMAIL`

5. Redeploy to apply environment variables:
   ```bash
   vercel --prod
   ```

## 📧 Email Notification Format

When someone submits the form, you'll receive an email with:
- Personal Information (Name, Email)
- Greek Organization Details (Org, Chapter, Line Name, Line Number)
- Social Media Links (if provided)
- Pari Picture (if uploaded)
- Submission Metadata (Timestamp, IP Address, User Agent)

## 💾 Adding Database Storage (Optional)

### Option 1: MongoDB

1. Install MongoDB driver:
   ```bash
   npm install mongodb
   ```

2. Add to `env`:
   ```env
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/lettered
   ```

3. Update `api/verification-submit.js`:
   ```javascript
   const { MongoClient } = require('mongodb');
   
   const client = new MongoClient(process.env.DATABASE_URL);
   await client.connect();
   const db = client.db('lettered');
   await db.collection('verifications').insertOne(sanitizedData);
   await client.close();
   ```

### Option 2: PostgreSQL/Supabase

1. Install PostgreSQL driver:
   ```bash
   npm install pg
   ```

2. Add to `env`:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/lettered
   ```

3. Update `api/verification-submit.js`:
   ```javascript
   const { Pool } = require('pg');
   
   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   await pool.query(
     'INSERT INTO verifications (fname, lname, email, ...) VALUES ($1, $2, $3, ...)',
     [sanitizedData.fname, sanitizedData.lname, sanitizedData.email, ...]
   );
   ```

### Option 3: Airtable (No Code Solution)

1. Install Airtable SDK:
   ```bash
   npm install airtable
   ```

2. Add to `env`:
   ```env
   AIRTABLE_API_KEY=your-api-key
   AIRTABLE_BASE_ID=your-base-id
   ```

3. Update `api/verification-submit.js`:
   ```javascript
   const Airtable = require('airtable');
   
   const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
     .base(process.env.AIRTABLE_BASE_ID);
   
   await base('Verifications').create([
     { fields: sanitizedData }
   ]);
   ```

## 🔧 Alternative Backend Options

If you don't want to use Vercel serverless functions, here are alternatives:

### 1. Formspree (Easiest - No Code)

Replace the API URL in `index.html`:
```javascript
const apiUrl = 'https://formspree.io/f/YOUR_FORM_ID';
```

Sign up at [formspree.io](https://formspree.io) to get your form ID.

### 2. EmailJS (No Backend Needed)

1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Add EmailJS SDK to your HTML:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```
3. Update the submit function to use EmailJS API

### 3. Custom Backend

Create your own backend with:
- Express.js + Node.js
- Python Flask/Django
- PHP
- Any backend framework you prefer

## 🧪 Testing the Form

1. **Test Honeypot**: Try filling the hidden "website" field - submission should fail silently
2. **Test Rate Limiting**: Submit twice within 5 minutes - should show error message
3. **Test Email Validation**: Try invalid emails - should show validation error
4. **Test File Upload**: Upload a picture - should be included in email
5. **Test Success Flow**: Valid submission should show success message and send email

## 🐛 Troubleshooting

### Form doesn't submit
- Check browser console for errors
- Verify all required fields are filled
- Check if you're being rate-limited

### Email not received
- Verify SMTP credentials in Vercel environment variables
- Check spam folder
- Verify SMTP_USER has "App Password" enabled (for Gmail)
- Check Vercel function logs for errors

### File upload fails
- Check file size (should be reasonable, < 5MB recommended)
- Verify file is an image type
- Check browser console for errors

## 📊 Monitoring Submissions

### View Logs in Vercel:
1. Go to Vercel Dashboard
2. Select your project
3. Navigate to "Functions" tab
4. Click on `/api/verification-submit`
5. View logs for each invocation

### Set Up Alerts:
You can set up email alerts or integrate with:
- Slack (webhook notifications)
- Discord (webhook notifications)
- SMS via Twilio
- Push notifications

## 🔐 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Rotate SMTP passwords regularly**
3. **Monitor for unusual activity** (multiple submissions from same IP)
4. **Keep dependencies updated**: `npm update`
5. **Enable 2FA** on your Vercel account
6. **Use strong app passwords** for SMTP
7. **Regularly review submission logs**

## 📝 Customization

### Change Rate Limit Duration:
In `index.html`, line ~949:
```javascript
if (lastVerificationSubmit && (now - parseInt(lastVerificationSubmit)) < 300000) {
// Change 300000 (5 minutes) to your preferred duration in milliseconds
```

In `api/verification-submit.js`, line ~76:
```javascript
if (lastSubmission && (now - lastSubmission) < 300000) {
// Change 300000 to match frontend
```

### Customize Email Template:
Edit the `emailHtml` variable in `api/verification-submit.js` (line ~140)

### Add More Fields:
1. Add field to HTML form
2. Add to `data` object in `handleVerificationSubmit()` function
3. Add to `sanitizedData` object in API handler
4. Add to email template

## 💡 Next Steps

- [ ] Set up email SMTP credentials
- [ ] Deploy to Vercel
- [ ] Test form submission
- [ ] (Optional) Add database storage
- [ ] (Optional) Set up submission notifications
- [ ] (Optional) Create admin dashboard to review submissions

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Test SMTP credentials with a simple email client
4. Review browser console for client-side errors

---

**Your form is now secure and ready to accept verification submissions!** 🎉

