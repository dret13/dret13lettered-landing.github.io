# Google Sheets - Quick Start (5 Minutes)

Need to start collecting submissions ASAP? Follow this ultra-fast setup.

## ⚡ Super Quick Setup (5 Steps)

### 1. Create Google Sheet (30 seconds)
```
1. Go to sheets.google.com
2. Click "Blank" spreadsheet
3. Name it: "Lettered Verifications"
4. Copy Sheet ID from URL (between /d/ and /edit)
```

**Headers (paste in Row 1):**
```
Timestamp	First Name	Last Name	Email	Organization	Chapter Name	City	University	Line Name	Line Number	Instagram	TikTok	Facebook	Twitter	Has Image	IP Address	User Agent
```

### 2. Create Service Account (2 minutes)
```
1. Go to: console.cloud.google.com
2. New Project → Name: "Lettered"
3. Enable API: Search "Google Sheets API" → Enable
4. Create Credentials → Service Account
   - Name: "form-writer"
   - Skip optional steps
5. Click on service account → Keys → Add Key → JSON
6. Download the JSON file
```

### 3. Share Sheet (10 seconds)
```
1. Open your Google Sheet
2. Click "Share"
3. Paste the email from JSON file (client_email field)
4. Give "Editor" access
5. Uncheck "Notify people" → Share
```

### 4. Add to Vercel (1 minute)
```
1. Go to vercel.com/dashboard → Your Project
2. Settings → Environment Variables
3. Add two variables:

Name: GOOGLE_SHEET_ID
Value: [your sheet ID from step 1]

Name: GOOGLE_SHEETS_CREDENTIALS  
Value: [entire JSON file content in ONE LINE]
```

### 5. Redeploy (30 seconds)
```bash
vercel --prod
```

## ✅ Done!

Every form submission now automatically saves to your Google Sheet!

## 📝 Column Reference

| Column | What It Stores |
|--------|---------------|
| A | Timestamp |
| B | First Name |
| C | Last Name |
| D | Email |
| E | Organization (alpha, aka, kappa, etc.) |
| F | Chapter Name |
| G | City |
| H | University |
| I | Line Name |
| J | Line Number |
| K | Instagram URL |
| L | TikTok URL |
| M | Facebook URL |
| N | Twitter URL |
| O | Has Pari Image (Yes/No) |
| P | IP Address |
| Q | User Agent |

## 🎨 Make It Pretty (Optional)

### Add Filters:
1. Select Row 1
2. Data → Create a filter

### Color Code Organizations:
1. Select "Organization" column
2. Format → Conditional formatting
3. Custom formula: `=E2="alpha"` → Blue
4. Add more rules for each org

### Add Verification Status Column:
1. Add header in column R: "Status"
2. Data validation: Pending, Approved, Rejected
3. Conditional format: Green for Approved, Red for Rejected

## 🚨 Troubleshooting

**Submissions not appearing?**
- Check Vercel logs: `vercel logs`
- Verify sheet is shared with service account email
- Ensure JSON credentials have no line breaks in Vercel

**Permission error?**
- Reshare the sheet with the service account
- Check the `client_email` in your JSON file

## 📱 Pro Tips

1. **Mobile App**: Install Google Sheets app for instant notifications
2. **Auto-Sort**: Data → Sort range → Sort by Timestamp (descending)
3. **Quick Stats**: Use `=COUNTIF(E:E,"alpha")` to count submissions by org
4. **Export**: File → Download → CSV for backups

## 🔐 Security

✅ Service account only has access to sheets you share with it
✅ Credentials stored securely in Vercel
✅ Can revoke access anytime by unsharing

## 📊 Sample Dashboard Formula

Add a new sheet called "Dashboard" with:

```
Total Submissions: =COUNTA(Sheet1!A:A)-1
Today: =COUNTIF(Sheet1!A:A,">="&TODAY())
Pending Review: =COUNTIF(Sheet1!R:R,"Pending")
```

---

**Need more details?** See `GOOGLE_SHEETS_SETUP.md`

**Last Updated**: 2025-10-10

