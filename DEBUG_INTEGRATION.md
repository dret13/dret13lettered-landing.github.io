# Debug Google Integration - Step by Step

You received the email but data isn't appearing in Sheets/Drive. Let's fix this!

## 🔍 The Error

```
Error: SyntaxError: Unexpected non-whitespace character after JSON at position 8
```

This means your `GOOGLE_SHEETS_CREDENTIALS` in Vercel has formatting issues.

## ✅ Complete Fix (10 Minutes)

### Step 1: Verify Your JSON Credentials Locally

**Test your credentials work:**

1. Create a file called `.env` in the `landing-page` folder (if you don't have one)

2. Open your service account JSON file from Google Cloud

3. Copy the **ENTIRE content** and minify it using: https://codebeautify.org/jsonminifier

4. Add to your `.env` file:
```env
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"...",...}
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
```

**Important**: Make sure there are NO line breaks in the JSON!

5. Test locally:
```bash
cd /Users/deandretaylor/Desktop/Lettered/landing-page
npm run dev
```

6. Submit a test form at http://localhost:3000

If it works locally, the issue is in Vercel environment variables!

### Step 2: Check Your Google Sheet Name

1. Open your Google Sheet
2. Look at the **tab name** at the bottom
3. Is it exactly **"Sheet1"**?

**If NOT "Sheet1"**:
- Either rename the tab to "Sheet1"
- OR update the code (see below)

**To update code for different sheet name:**

Open `api/verification-submit.js` and find line 163:
```javascript
range: 'Sheet1!A:Q', // Change 'Sheet1' to your actual sheet name
```

Change `Sheet1` to whatever your tab is called (e.g., `Submissions`, `Data`, etc.)

### Step 3: Fix Vercel Environment Variables

This is the most common issue!

#### Option A: Copy from Local (Easiest)

1. Open your `.env` file
2. Copy the ENTIRE value after `GOOGLE_SHEETS_CREDENTIALS=`
3. Go to Vercel Dashboard → Settings → Environment Variables
4. Edit `GOOGLE_SHEETS_CREDENTIALS`
5. **DELETE everything** in the value field
6. Paste the value from your `.env`
7. Save

#### Option B: Minify and Upload Fresh

1. Open your JSON file in text editor
2. Go to: https://codebeautify.org/jsonminifier
3. Paste JSON content
4. Click "Minify"
5. Copy the minified result
6. Go to Vercel → Environment Variables
7. Edit `GOOGLE_SHEETS_CREDENTIALS`
8. Paste minified JSON
9. Save

### Step 4: Verify All Environment Variables

Check that ALL of these are set in Vercel:

✅ `SMTP_HOST`
✅ `SMTP_PORT`
✅ `SMTP_USER`
✅ `SMTP_PASS`
✅ `NOTIFICATION_EMAIL`
✅ `GOOGLE_SHEET_ID`
✅ `GOOGLE_SHEETS_CREDENTIALS` (minified, one line!)
✅ `GOOGLE_DRIVE_FOLDER_ID`

### Step 5: Redeploy

```bash
cd /Users/deandretaylor/Desktop/Lettered/landing-page
vercel --prod
```

### Step 6: Test Again

Submit a new test form and check:
1. ✅ Email received?
2. ✅ Data in Google Sheet?
3. ✅ Image in Google Drive?

---

## 🔍 Additional Checks

### Check 1: Sheet Permissions

1. Open your Google Sheet
2. Click "Share" button
3. Verify your service account email is listed
4. Should have "Editor" access

**Service account email** is in your JSON file: `client_email` field

### Check 2: Drive Folder Permissions

1. Open Google Drive folder
2. Right-click → Share
3. Verify service account email is listed
4. Should have "Editor" access

### Check 3: APIs Enabled

Go to [Google Cloud Console](https://console.cloud.google.com/):

1. Select your project
2. APIs & Services → Enabled APIs
3. Verify BOTH are enabled:
   - ✅ Google Sheets API
   - ✅ Google Drive API

If not, enable them!

### Check 4: Sheet ID is Correct

From your sheet URL:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0/edit
                                      └──────────┬────────┘
                                            This is the ID
```

Copy JUST the ID part (not the full URL)

### Check 5: Drive Folder ID is Correct

From your Drive folder URL:
```
https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0
                                       └──────────┬────────┘
                                             This is the ID
```

Copy JUST the ID part (not the full URL)

---

## 🧪 Test Script

I've created `test-json.js` for you. Use it to validate your credentials:

```bash
# Edit test-json.js and paste your minified JSON
node test-json.js
```

Should output:
```
✅ JSON is VALID!
Service Account Email: your-account@project.iam.gserviceaccount.com
Project ID: your-project-id
```

If you get an error, your JSON needs fixing!

---

## 📋 Common JSON Issues

### Issue 1: Line Breaks
**❌ Wrong:**
```
{
  "type": "service_account",
  "project_id": "..."
}
```

**✅ Correct:**
```
{"type":"service_account","project_id":"..."}
```

### Issue 2: Extra Quotes
**❌ Wrong:**
```
"{"type":"service_account"}"
```

**✅ Correct:**
```
{"type":"service_account"}
```

### Issue 3: Trailing Comma in Vercel
**❌ Wrong:**
```
{"type":"service_account"},
```

**✅ Correct:**
```
{"type":"service_account"}
```

### Issue 4: Spaces Before/After
**❌ Wrong:**
```
  {"type":"service_account"}  
```

**✅ Correct:**
```
{"type":"service_account"}
```

---

## 🎯 After Fixing, Test This Way

### Test 1: Local Development
```bash
npm run dev
# Go to http://localhost:3000
# Submit form
# Check console for logs
```

### Test 2: Check Vercel Logs

After deployment, go to:
1. Vercel Dashboard → Your Project
2. Deployments → Click latest deployment
3. Functions → Click `/api/verification-submit`
4. View logs

**Look for:**
- ✅ "Successfully wrote to Google Sheets"
- ✅ "Image uploaded to Google Drive"
- ❌ Any error messages

### Test 3: Verify Data Flow

Submit a test form with:
- ✅ All required fields
- ✅ A test image

Then check:
1. **Email** - Should receive notification ✅
2. **Google Sheet** - Should have new row
3. **Google Drive** - Should have image file
4. **Sheet Column O** - Should have Drive link

---

## 🆘 Still Not Working?

### Double-Check This Exact Sequence:

1. ✅ Service account created in Google Cloud
2. ✅ Service account JSON key downloaded
3. ✅ JSON minified to ONE LINE
4. ✅ Google Sheets API enabled
5. ✅ Google Drive API enabled
6. ✅ Sheet shared with service account email
7. ✅ Drive folder shared with service account email
8. ✅ Sheet tab named "Sheet1" (or code updated)
9. ✅ All environment variables in Vercel
10. ✅ Redeployed after adding variables

### Get the Service Account Email:

1. Open your JSON file
2. Find this line:
```json
"client_email": "something@project-id.iam.gserviceaccount.com"
```
3. Copy that email
4. Verify it's shared on BOTH Sheet and Drive folder

### Verify Environment Variables Format:

In Vercel, environment variables should look EXACTLY like this:

**GOOGLE_SHEET_ID**:
```
1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```
(Just the ID, no URL)

**GOOGLE_DRIVE_FOLDER_ID**:
```
1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l
```
(Just the ID, no URL)

**GOOGLE_SHEETS_CREDENTIALS**:
```
{"type":"service_account","project_id":"your-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n","client_email":"name@project.iam.gserviceaccount.com","client_id":"123456","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/name%40project.iam.gserviceaccount.com"}
```
(ONE continuous line, no breaks!)

---

## 📞 Quick Support Checklist

When asking for help, provide:

1. **Error message** from Vercel logs
2. **Sheet tab name** (bottom of your sheet)
3. **Confirmation** that APIs are enabled
4. **Confirmation** that service account email is shared
5. **Test result** from `node test-json.js`

---

## ✅ Success Indicators

After fixing, you should see:

**In Vercel Logs:**
```
✅ Successfully wrote to Google Sheets
✅ Image uploaded to Google Drive: https://drive.google.com/...
✅ Verification submitted successfully
```

**In Your Google Sheet:**
```
New row appears with all form data
Column O shows Drive link (if image uploaded)
```

**In Your Google Drive:**
```
New image file appears in folder
Filename includes timestamp and email
Can click and view image
```

**In Your Email:**
```
Notification received
Image attached
All form details shown
```

---

## 🎯 Most Likely Solution

**99% of the time**, this issue is fixed by:

1. Minifying the JSON (make it ONE line)
2. Updating it in Vercel
3. Redeploying

Try that first before anything else!

---

**Last Updated**: 2025-10-10

