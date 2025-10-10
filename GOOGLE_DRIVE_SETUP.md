# Google Drive Image Storage Setup Guide

This guide shows you how to set up Google Drive to automatically store pari images uploaded through the verification form.

## 📸 What This Does

Instead of just marking "Yes/No" for images, the system will now:
1. **Upload images to Google Drive** automatically
2. **Store the link in Google Sheets** (clickable URL)
3. **Organize images in a dedicated folder**
4. **Keep images accessible and backed up**

## ✅ Before You Start

Make sure you've already completed:
- ✅ Google Sheets setup (GOOGLE_SHEETS_SETUP.md)
- ✅ Service account created with credentials

**Good news**: You'll use the **same service account** - no need to create a new one!

## 🚀 Setup Steps (5 Minutes)

### Step 1: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Click **"+ New"** → **"Folder"**
3. Name it: **"Lettered Pari Images"** (or your preferred name)
4. Click **"Create"**

### Step 2: Get the Folder ID

1. **Double-click** the folder to open it
2. Look at the URL in your browser:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
                                         ^^^^^^^^^^^^^^^^
   ```
3. Copy the **FOLDER_ID_HERE** part
4. Save it - you'll need it soon!

### Step 3: Share Folder with Service Account

1. In Google Drive, **right-click** the folder
2. Click **"Share"**
3. Paste your **service account email**
   - Find it in your JSON credentials file: `client_email` field
   - Looks like: `something@project-id.iam.gserviceaccount.com`
4. Give it **"Editor"** permissions
5. **Uncheck** "Notify people"
6. Click **"Share"**

### Step 4: Enable Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the one you created for Sheets)
3. Go to **"APIs & Services"** → **"Library"**
4. Search for **"Google Drive API"**
5. Click on it and press **"Enable"**

### Step 5: Add Environment Variable

#### For Local Development:

Edit your `.env` file and add:

```env
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-from-step-2
```

#### For Vercel Deployment:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Click **"Add New"**:
   - **Name**: `GOOGLE_DRIVE_FOLDER_ID`
   - **Value**: Your folder ID from Step 2
   - **Environment**: Production, Preview, Development
5. Click **"Save"**

### Step 6: Redeploy

```bash
vercel --prod
```

That's it! 🎉

## 🧪 Testing

1. Go to your verification form
2. Fill it out and **upload a test image**
3. Submit the form
4. Check your Google Drive folder - the image should appear!
5. Check your Google Sheet - column O should now have a **clickable link** instead of just "Yes"

## 📋 What Gets Stored

### File Naming Format:
```
2025-10-10T15-30-45-123Z_john_doe_example_com_image.jpg
└─────────────────────┬────────────────┘└─────┬─────┘└─┬┘
                 Timestamp              User Email    Original Name
```

### File Organization:
```
Lettered Pari Images/
├── 2025-10-10T15-30-45_john_email_com_image1.jpg
├── 2025-10-10T16-45-22_jane_email_com_photo.png
├── 2025-10-10T17-15-33_mike_email_com_pari.jpg
└── ...
```

### In Google Sheets:
- **Before**: Column O shows "Yes" or "No"
- **After**: Column O shows clickable Google Drive link or "No Image"

Example: `https://drive.google.com/file/d/ABC123.../view`

## 🎨 Organize Your Images (Optional)

### Create Subfolders by Month:

1. In your main folder, create subfolders:
   ```
   Lettered Pari Images/
   ├── 2025-October/
   ├── 2025-November/
   └── 2025-December/
   ```

2. Manually move images to monthly folders (or create a script)

### Create Subfolders by Organization:

```
Lettered Pari Images/
├── Alpha Phi Alpha/
├── Alpha Kappa Alpha/
├── Delta Sigma Theta/
└── ...
```

**Note**: The current script uploads to the main folder. You can modify it to create subfolders automatically.

## 🔐 Security & Privacy

### Access Control:
- Images are set to **"Anyone with the link"** can view
- Links are only in your private Google Sheet
- Only you and people you share the sheet with can see the links
- Service account can only access folders you specifically share

### Storage Limits:
- **Free tier**: 15 GB shared across Gmail, Drive, Photos
- **Average image size**: 1-3 MB
- **Capacity**: ~5,000-15,000 images before needing more storage
- **Paid plans**: 100 GB ($1.99/month), 200 GB ($2.99/month)

### Best Practices:
1. ✅ Never share the service account credentials
2. ✅ Keep the Drive folder private
3. ✅ Only share Sheet with trusted team members
4. ✅ Periodically archive old images
5. ✅ Monitor storage usage in Drive

## 📊 View Images from Sheets

### Quick View:
1. Open your Google Sheet
2. Click any link in column O
3. Image opens in Google Drive viewer
4. Download, share, or zoom as needed

### Bulk Download:
1. Open the Drive folder
2. Select multiple images (Shift+click)
3. Right-click → Download
4. Gets downloaded as a ZIP file

## 🔧 Advanced: Apps Script to Display Images in Sheet

Want to see thumbnail previews directly in the sheet?

1. In Google Sheets, go to **Extensions** → **Apps Script**
2. Paste this code:

```javascript
function showImagePreview(driveUrl) {
  if (!driveUrl || driveUrl === 'No Image') return '';
  
  // Extract file ID from Drive URL
  const fileId = driveUrl.match(/\/d\/(.+?)\//)[1];
  
  // Return image formula
  return `=IMAGE("https://drive.google.com/uc?id=${fileId}")`;
}
```

3. In your sheet, add a new column P: **"Image Preview"**
4. In cell P2, add formula:
```
=IF(O2="No Image","",IMAGE(REGEXEXTRACT(O2,"\/d\/(.+?)\/")))
```
5. Drag formula down to all rows

Now you'll see thumbnail previews! 🖼️

## 🐛 Troubleshooting

### Images not uploading?

**Check:**
1. ✅ `GOOGLE_DRIVE_FOLDER_ID` is set in environment variables
2. ✅ Google Drive API is enabled in Cloud Console
3. ✅ Folder is shared with service account
4. ✅ Service account has Editor permissions
5. ✅ Credentials are valid (same as Sheets)

**Test:**
- Check Vercel function logs: `vercel logs`
- Look for "Image uploaded to Google Drive" message
- Check for errors mentioning "Drive" or "permission"

### Links not appearing in Sheet?

**Check:**
1. ✅ Column O in sheet (or adjust range in code)
2. ✅ Sheet name is correct ("Sheet1" or "Submissions")
3. ✅ Both Drive and Sheets are working

### "Permission denied" error?

**Solutions:**
- Reshare the folder with service account
- Verify service account email is correct
- Check service account has "Editor" role
- Ensure Drive API is enabled

### "File too large" error?

**Solutions:**
- Current limit: None set (uses Drive default ~5GB)
- Add size check in frontend if needed
- Compress images before upload
- Recommended max: 10 MB per image

## 💾 Storage Management

### Check Storage Usage:
1. Go to [Google Drive](https://drive.google.com)
2. Look at bottom-left: "X GB of 15 GB used"
3. Or visit: [Google One Storage](https://one.google.com/storage)

### Archive Old Images:
```javascript
// Add to Apps Script
function archiveOldImages() {
  // Move images older than 90 days to archive folder
  const drive = DriveApp;
  const mainFolder = drive.getFolderById('YOUR_FOLDER_ID');
  const archiveFolder = drive.getFolderById('YOUR_ARCHIVE_FOLDER_ID');
  
  const files = mainFolder.getFiles();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  while (files.hasNext()) {
    const file = files.next();
    if (file.getDateCreated() < ninetyDaysAgo) {
      file.moveTo(archiveFolder);
    }
  }
}
```

## 📱 Mobile Access

### View Images on Phone:
1. Install **Google Drive** app
2. Navigate to "Lettered Pari Images" folder
3. Tap any image to view full size
4. Share, download, or delete as needed

### Review Submissions on Mobile:
1. Open **Google Sheets** app
2. Open your verification sheet
3. Tap links in column O to view images
4. Images open in Drive app

## 🔄 Image Backup

Images are automatically backed up by Google Drive, but you can add extra protection:

### Option 1: Google Takeout (Manual)
1. Go to [Google Takeout](https://takeout.google.com/)
2. Select **"Drive"**
3. Choose your folder
4. Export and download

### Option 2: Automated Backup
Use Google Drive for Desktop:
1. Install [Google Drive for Desktop](https://www.google.com/drive/download/)
2. Select "Lettered Pari Images" folder
3. Enable "Mirror files"
4. Folder syncs to your computer automatically

## ✅ Setup Checklist

- [ ] Google Drive folder created
- [ ] Folder ID copied
- [ ] Folder shared with service account
- [ ] Google Drive API enabled
- [ ] Environment variable added locally
- [ ] Environment variable added to Vercel
- [ ] Redeployed to Vercel
- [ ] Test image uploaded successfully
- [ ] Image appears in Drive folder
- [ ] Link appears in Google Sheet
- [ ] Link is clickable and opens image

## 📈 Monitoring & Stats

### Track Upload Stats:
Add to your Dashboard sheet:

```
Total Images Uploaded:
=COUNTIF(Submissions!O:O,"https://drive*")

Upload Rate:
=COUNTIF(Submissions!O:O,"https://drive*")/COUNTA(Submissions!O:O)
```

### Recent Uploads:
```
Last Image Upload:
=QUERY(Submissions!A:O,"SELECT A WHERE O CONTAINS 'https://drive' ORDER BY A DESC LIMIT 1")
```

## 🆘 Need Help?

- **Vercel Logs**: `vercel logs` in terminal
- **Check Service Account**: Verify email in JSON file
- **Test Locally**: `npm run dev` and submit test form
- **Drive API**: Confirm it's enabled in Cloud Console
- **Permissions**: Reshare folder if needed

---

**Status**: Images now auto-save to Google Drive! 📸

**Sheet Column O**: Now shows clickable Drive links

**Last Updated**: 2025-10-10

