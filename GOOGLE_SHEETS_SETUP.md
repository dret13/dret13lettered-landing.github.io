# Google Sheets Integration Setup Guide

This guide will walk you through setting up Google Sheets to automatically store form submissions.

## 📋 What You'll Get

Every form submission will automatically create a new row in your Google Sheet with:
- Timestamp
- Name, Email
- Organization details
- Chapter information
- Line name & number
- Social media links
- Pari image indicator
- IP address & user agent

## 🚀 Setup Steps

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Lettered Verification Submissions" (or your preferred name)
4. Add these column headers in Row 1:

```
Timestamp | First Name | Last Name | Email | Organization | Chapter Name | City | University | Line Name | Line Number | Instagram | TikTok | Facebook | Twitter | Has Image | IP Address | User Agent
```

5. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
                                            ^^^^^^^^^^^^
   ```

### Step 2: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Lettered Form" (or your preferred name)
4. Click "Create"

### Step 3: Enable Google Sheets API

1. In your Google Cloud project, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### Step 4: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - **Service account name**: `lettered-form-writer`
   - **Service account ID**: (auto-generated)
   - **Description**: `Writes verification form submissions to Google Sheets`
4. Click "Create and Continue"
5. Skip "Grant this service account access" (click Continue)
6. Skip "Grant users access" (click Done)

### Step 5: Generate Service Account Key

1. Find your newly created service account in the list
2. Click on it to open details
3. Go to the "Keys" tab
4. Click "Add Key" → "Create new key"
5. Choose "JSON" format
6. Click "Create"
7. **Save the downloaded JSON file securely** (you'll need it soon)

### Step 6: Share Google Sheet with Service Account

1. Open the downloaded JSON file
2. Find the `client_email` field (looks like: `something@project-id.iam.gserviceaccount.com`)
3. Copy this email address
4. Go back to your Google Sheet
5. Click the "Share" button
6. Paste the service account email
7. Give it "Editor" permissions
8. Uncheck "Notify people"
9. Click "Share"

### Step 7: Add Credentials to Environment Variables

#### For Local Development:

1. Open your `.env` file in the `landing-page` folder
2. Add these variables:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=your-sheet-id-here
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Important**: For `GOOGLE_SHEETS_CREDENTIALS`, copy the **entire contents** of your downloaded JSON file into one line.

#### For Vercel Deployment:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add two variables:

**Variable 1:**
- **Name**: `GOOGLE_SHEET_ID`
- **Value**: Your sheet ID (from Step 1)
- **Environment**: Production, Preview, Development

**Variable 2:**
- **Name**: `GOOGLE_SHEETS_CREDENTIALS`
- **Value**: The entire JSON content (copy from downloaded file)
- **Environment**: Production, Preview, Development

5. Click "Save"

### Step 8: Install Dependencies

```bash
cd landing-page
npm install
```

### Step 9: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and submit a test verification. Check your Google Sheet - a new row should appear!

### Step 10: Deploy to Vercel

```bash
vercel --prod
```

Your form will now automatically save all submissions to Google Sheets! 🎉

## 🔐 Security Notes

1. **Never commit** the service account JSON file to Git
2. **Never share** your service account credentials
3. **Keep the `.env` file** in `.gitignore`
4. The service account only has access to sheets you specifically share with it
5. You can revoke access anytime by removing the service account from the sheet's sharing settings

## 📊 What Gets Saved

Each submission creates a new row with these columns:

| Column | Data | Example |
|--------|------|---------|
| Timestamp | Submission date/time | "10/10/2025, 3:45:30 PM" |
| First Name | User's first name | "John" |
| Last Name | User's last name | "Smith" |
| Email | User's email | "john@example.com" |
| Organization | Selected D9 org | "alpha" |
| Chapter Name | Chapter name | "Beta Alpha" |
| City | Chapter city | "Atlanta" |
| University | Chapter university | "Georgia Tech" |
| Line Name | User's line name | "Smooth Operator" |
| Line Number | User's line number | "7" |
| Instagram | Instagram URL | "https://instagram.com/..." |
| TikTok | TikTok URL | "https://tiktok.com/..." |
| Facebook | Facebook URL | "https://facebook.com/..." |
| Twitter | Twitter URL | "https://twitter.com/..." |
| Has Image | Whether they uploaded pari image | "Yes" or "No" |
| IP Address | Submission IP | "192.168.1.1" |
| User Agent | Browser info | "Mozilla/5.0..." |

## 🎨 Customize Your Sheet

### Add Conditional Formatting

1. Select the "Has Image" column
2. Format → Conditional formatting
3. Set rule: "Text is exactly" → "Yes"
4. Choose green background
5. Add another rule for "No" with red background

### Add Filters

1. Select row 1 (headers)
2. Data → Create a filter
3. Now you can filter by organization, chapter, etc.

### Add Data Validation

1. Create a dropdown for verification status
2. Select a new column (e.g., column R)
3. Add header "Verification Status"
4. Data → Data validation
5. Criteria: List of items → "Pending, Approved, Rejected"

## 🔍 View Submissions

1. Open your Google Sheet
2. New submissions appear at the bottom
3. Use filters to find specific submissions
4. Sort by timestamp to see latest first
5. Export to CSV if needed (File → Download → CSV)

## 📱 Mobile Access

Install Google Sheets app on your phone to:
- Get notifications for new submissions
- Review submissions on-the-go
- Update verification status anywhere

## 🔄 Backup Your Data

Google Sheets auto-saves, but you can also:
1. File → Make a copy (weekly backup)
2. File → Download → Excel format
3. Store backups in Google Drive folder

## 🐛 Troubleshooting

### Submissions not appearing in sheet?

1. Check Vercel function logs for errors
2. Verify GOOGLE_SHEET_ID is correct
3. Confirm service account has "Editor" access
4. Check credentials are valid JSON (no line breaks)

### "Permission denied" error?

- Make sure you shared the sheet with the service account email
- Check the email in the JSON file's `client_email` field
- Reshare the sheet if needed

### Credentials not working in Vercel?

- Ensure no line breaks in the GOOGLE_SHEETS_CREDENTIALS value
- Copy the entire JSON content as one line
- Redeploy after adding environment variables

## 💡 Pro Tips

### Tip 1: Add a Dashboard Sheet
Create a second sheet with formulas to summarize data:
- Total submissions by organization
- Submissions per day
- Pending vs approved count

### Tip 2: Set Up Email Alerts
Use Google Sheets + Google Apps Script to email you when new submissions arrive:
1. Tools → Script editor
2. Add a trigger for "onChange"
3. Send email notification

### Tip 3: Auto-Archive Old Submissions
Create a monthly archive:
1. File → Make a copy
2. Name it with month/year
3. Clear old data from main sheet

## 📊 Sample Apps Script for Notifications

```javascript
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // If a new row is added
  if (range.getRow() > 1) {
    const email = 'your-email@gmail.com';
    const subject = 'New Verification Submission';
    const body = 'A new verification form was submitted. Check your sheet!';
    
    MailApp.sendEmail(email, subject, body);
  }
}
```

## ✅ Verification Checklist

- [ ] Google Sheet created with headers
- [ ] Sheet ID copied
- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created
- [ ] Service account key downloaded
- [ ] Sheet shared with service account
- [ ] Environment variables added locally
- [ ] Environment variables added to Vercel
- [ ] Dependencies installed
- [ ] Tested locally
- [ ] Deployed to production
- [ ] Test submission successful

## 🆘 Need Help?

- Check Vercel function logs: `vercel logs`
- Test locally first: `npm run dev`
- Verify sheet permissions
- Double-check environment variables

---

**Status**: Ready to save submissions to Google Sheets! 📝

**Last Updated**: 2025-10-10

