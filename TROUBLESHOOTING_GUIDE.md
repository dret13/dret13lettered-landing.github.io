# Troubleshooting Guide - Google Sheets & Drive Integration

## 🚨 Common Issue: "Unexpected non-whitespace character after JSON"

This error means your Google credentials in Vercel are not formatted correctly.

### ✅ Quick Fix (5 minutes)

#### 1. Get Your JSON File
- Open the service account JSON file you downloaded from Google Cloud
- It should look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-123456",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

#### 2. Minify It (Remove Line Breaks)

**Online Tool Method** (Easiest):
1. Go to: https://codebeautify.org/jsonminifier
2. Paste your JSON
3. Click "Minify"
4. Copy the result

**Result should be ONE LINE**:
```
{"type":"service_account","project_id":"your-project-123456","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/..."}
```

#### 3. Test Locally First

1. Open `test-json.js` in the landing-page folder
2. Replace `PASTE_YOUR_MINIFIED_JSON_HERE` with your minified JSON
3. Run the test:

```bash
cd /Users/deandretaylor/Desktop/Lettered/landing-page
node test-json.js
```

**Expected output**:
```
✅ JSON is VALID!
Service Account Email: your-service-account@project.iam.gserviceaccount.com
Project ID: your-project-123456

You can safely use this in Vercel!
```

#### 4. Update Vercel

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Find `GOOGLE_SHEETS_CREDENTIALS`
4. Click **⋯** → **Edit**
5. **Clear everything** in the value field
6. Paste your **minified JSON** (the ONE LINE version)
7. Save

#### 5. Redeploy

```bash
vercel --prod
```

Wait for deployment to complete, then test again!

---

## 🔍 Step-by-Step Debugging Checklist

### Issue: Form Submits but No Data in Sheets/Drive

**Check #1: Environment Variables in Vercel**

Run this to see what's set:
```bash
cd /Users/deandretaylor/Desktop/Lettered/landing-page
vercel env ls
```

Should show:
- ✅ `GOOGLE_SHEET_ID`
- ✅ `GOOGLE_SHEETS_CREDENTIALS`
- ✅ `GOOGLE_DRIVE_FOLDER_ID` (if using Drive)
- ✅ `SMTP_HOST`, `SMTP_USER`, etc.

**Check #2: Sheet Name**

Open your Google Sheet and check the tab name at the bottom:
- Is it "Sheet1"? ✅ Good
- Is it something else? ⚠️ Need to update code

If not "Sheet1", update the API:

<function_calls>
<invoke name="read_file">
<parameter name="target_file">/Users/deandretaylor/Desktop/Lettered/landing-page/api/verification-submit.js
