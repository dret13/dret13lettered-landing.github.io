# Google Sheets Pro Tips - Complete Setup Guide

This guide will walk you through implementing the 3 pro tips to supercharge your verification submissions management.

## 📊 Pro Tip #1: Add a Dashboard Sheet

Create a second sheet with automatic statistics and summaries.

### Step-by-Step Setup:

#### 1. Create Dashboard Sheet (1 minute)

1. In your Google Sheet, click the **"+"** button at the bottom to add a new sheet
2. Rename it to **"Dashboard"**
3. Go back to your main sheet (Sheet1) and rename it to **"Submissions"** for clarity

#### 2. Set Up Dashboard Layout (3 minutes)

Copy and paste this into your Dashboard sheet:

**Cell A1:**
```
LETTERED VERIFICATION DASHBOARD
```
Format: Bold, Size 18, Center align

**Cell A3:**
```
📊 OVERVIEW STATISTICS
```

**Cell A5:** `Total Submissions:`
**Cell B5:** 
```
=COUNTA(Submissions!A:A)-1
```

**Cell A6:** `Submissions Today:`
**Cell B6:**
```
=COUNTIF(Submissions!A:A,">="&TEXT(TODAY(),"M/d/yyyy"))
```

**Cell A7:** `Submissions This Week:`
**Cell B7:**
```
=COUNTIF(Submissions!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY())+1,"M/d/yyyy"))
```

**Cell A8:** `Submissions This Month:`
**Cell B8:**
```
=COUNTIF(Submissions!A:A,">="&TEXT(EOMONTH(TODAY(),-1)+1,"M/d/yyyy"))
```

**Cell A10:**
```
🎓 SUBMISSIONS BY ORGANIZATION
```

**Cell A12:** `Alpha Phi Alpha:`
**Cell B12:**
```
=COUNTIF(Submissions!E:E,"alpha")
```

**Cell A13:** `Alpha Kappa Alpha:`
**Cell B13:**
```
=COUNTIF(Submissions!E:E,"aka")
```

**Cell A14:** `Kappa Alpha Psi:`
**Cell B14:**
```
=COUNTIF(Submissions!E:E,"kappa")
```

**Cell A15:** `Omega Psi Phi:`
**Cell B15:**
```
=COUNTIF(Submissions!E:E,"que")
```

**Cell A16:** `Delta Sigma Theta:`
**Cell B16:**
```
=COUNTIF(Submissions!E:E,"delta")
```

**Cell A17:** `Phi Beta Sigma:`
**Cell B17:**
```
=COUNTIF(Submissions!E:E,"sigma")
```

**Cell A18:** `Sigma Gamma Rho:`
**Cell B18:**
```
=COUNTIF(Submissions!E:E,"sgrho")
```

**Cell A19:** `Zeta Phi Beta:`
**Cell B19:**
```
=COUNTIF(Submissions!E:E,"zeta")
```

**Cell A20:** `Iota Phi Theta:`
**Cell B20:**
```
=COUNTIF(Submissions!E:E,"iota")
```

**Cell A22:**
```
📸 VERIFICATION DETAILS
```

**Cell A24:** `With Pari Image:`
**Cell B24:**
```
=COUNTIF(Submissions!O:O,"Yes")
```

**Cell A25:** `Without Image:`
**Cell B25:**
```
=COUNTIF(Submissions!O:O,"No")
```

**Cell A26:** `With Social Media:`
**Cell B26:**
```
=COUNTA(Submissions!K:K)-1
```

**Cell A28:**
```
📅 RECENT ACTIVITY
```

**Cell A30:** `Last Submission:`
**Cell B30:**
```
=MAX(Submissions!A:A)
```

**Cell A31:** `Most Common Organization:`
**Cell B31:**
```
=INDEX({"Alpha Phi Alpha";"Alpha Kappa Alpha";"Kappa Alpha Psi";"Omega Psi Phi";"Delta Sigma Theta";"Phi Beta Sigma";"Sigma Gamma Rho";"Zeta Phi Beta";"Iota Phi Theta"},MATCH(MAX(B12:B20),B12:B20,0))
```

#### 3. Add Visual Formatting (2 minutes)

1. **Header Section (A1):**
   - Background: Dark green (#22311D)
   - Text: White, Bold, 18pt

2. **Section Headers (A3, A10, A22, A28):**
   - Background: Light green (#D4EDDA)
   - Text: Dark green, Bold, 14pt

3. **Labels (Column A):**
   - Bold, Align right

4. **Values (Column B):**
   - Font size: 14pt
   - Align left

5. **Add borders:**
   - Select all data → Format → Borders → All borders

#### 4. Add Organization Chart (Optional - 3 minutes)

1. Select cells A12:B20
2. Insert → Chart
3. Chart type: **Pie chart** or **Column chart**
4. Customize:
   - Chart title: "Submissions by Organization"
   - Use org colors if desired
5. Move chart to position D3

### Result:
You now have a live dashboard that updates automatically! 📊

---

## 📧 Pro Tip #2: Set Up Email Alerts

Get notified instantly when new submissions arrive.

### Option A: Simple Email Alert (Easiest - 5 minutes)

#### 1. Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Paste the following code:

```javascript
function onFormSubmit() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Submissions');
  const lastRow = sheet.getLastRow();
  
  // Get the last submitted data
  const data = sheet.getRange(lastRow, 1, 1, 17).getValues()[0];
  
  // Extract data
  const timestamp = data[0];
  const firstName = data[1];
  const lastName = data[2];
  const email = data[3];
  const organization = data[4];
  const chapterName = data[5];
  const city = data[6];
  const university = data[7];
  const lineName = data[8];
  const lineNumber = data[9];
  const hasImage = data[14];
  
  // Organization names mapping
  const orgNames = {
    'alpha': 'Alpha Phi Alpha',
    'aka': 'Alpha Kappa Alpha',
    'kappa': 'Kappa Alpha Psi',
    'que': 'Omega Psi Phi',
    'delta': 'Delta Sigma Theta',
    'sigma': 'Phi Beta Sigma',
    'sgrho': 'Sigma Gamma Rho',
    'zeta': 'Zeta Phi Beta',
    'iota': 'Iota Phi Theta'
  };
  
  const orgFullName = orgNames[organization] || organization;
  
  // Email settings
  const recipient = 'your-email@gmail.com'; // ⬅️ CHANGE THIS
  const subject = `🔔 New Verification: ${firstName} ${lastName} - ${orgFullName}`;
  
  // Create email body
  const body = `
New Verification Submission Received!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PERSONAL INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${firstName} ${lastName}
Email: ${email}
Timestamp: ${timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 GREEK ORGANIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Organization: ${orgFullName}
Chapter: ${chapterName}
City: ${city}
University: ${university}

Line Name: ${lineName}
Line Number: ${lineNumber}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 VERIFICATION INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pari Image: ${hasImage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View all submissions:
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

---
Lettered Verification System
`;
  
  // Send email
  MailApp.sendEmail(recipient, subject, body);
  
  Logger.log('Email sent to ' + recipient);
}

// Test function - Run this first to test
function testEmail() {
  const recipient = 'your-email@gmail.com'; // ⬅️ CHANGE THIS
  const subject = '✅ Test Email - Lettered Verification Alert';
  const body = 'If you receive this email, your alert system is working correctly!';
  
  MailApp.sendEmail(recipient, subject, body);
  Logger.log('Test email sent!');
}
```

#### 2. Configure Your Email

In the code above, find this line (appears twice):
```javascript
const recipient = 'your-email@gmail.com'; // ⬅️ CHANGE THIS
```

Replace `your-email@gmail.com` with your actual email address.

#### 3. Test the Email Alert

1. Click the **testEmail** function in the dropdown at the top
2. Click **Run** (play button)
3. **First time only:** You'll need to authorize the script:
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced"
   - Click "Go to [Your Sheet Name] (unsafe)"
   - Click "Allow"
4. Check your email - you should receive a test email!

#### 4. Set Up Trigger to Run Automatically

1. In Apps Script Editor, click the **clock icon** (Triggers) on the left
2. Click **"+ Add Trigger"** (bottom right)
3. Configure:
   - **Function**: `onFormSubmit`
   - **Deployment**: Head
   - **Event source**: From spreadsheet
   - **Event type**: On change
   - **Failure notification**: Daily
4. Click **Save**

#### 5. Test with Real Submission

Submit a test form on your website. Within a few seconds, you should receive an email notification!

### Option B: Advanced Email with HTML (10 minutes)

For prettier emails with better formatting:

```javascript
function onFormSubmitAdvanced() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Submissions');
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(lastRow, 1, 1, 17).getValues()[0];
  
  const timestamp = data[0];
  const firstName = data[1];
  const lastName = data[2];
  const email = data[3];
  const organization = data[4];
  const chapterName = data[5];
  const city = data[6];
  const university = data[7];
  const lineName = data[8];
  const lineNumber = data[9];
  const instagram = data[10];
  const tiktok = data[11];
  const facebook = data[12];
  const twitter = data[13];
  const hasImage = data[14];
  
  const orgNames = {
    'alpha': 'Alpha Phi Alpha',
    'aka': 'Alpha Kappa Alpha',
    'kappa': 'Kappa Alpha Psi',
    'que': 'Omega Psi Phi',
    'delta': 'Delta Sigma Theta',
    'sigma': 'Phi Beta Sigma',
    'sgrho': 'Sigma Gamma Rho',
    'zeta': 'Zeta Phi Beta',
    'iota': 'Iota Phi Theta'
  };
  
  const orgFullName = orgNames[organization] || organization;
  
  const recipient = 'your-email@gmail.com'; // ⬅️ CHANGE THIS
  const subject = `🔔 New Verification: ${firstName} ${lastName}`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #22311D; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .section { margin-bottom: 20px; }
    .section-title { background: #D4EDDA; padding: 10px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #22311D; }
    .field { display: flex; margin-bottom: 8px; }
    .label { font-weight: bold; min-width: 150px; }
    .value { flex: 1; }
    .footer { background: #22311D; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #970000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
    .badge { background: ${hasImage === 'Yes' ? '#28a745' : '#dc3545'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 New Verification Submission</h1>
      <p style="margin: 0;">Received on ${timestamp}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">📋 Personal Information</div>
        <div class="field">
          <div class="label">Name:</div>
          <div class="value">${firstName} ${lastName}</div>
        </div>
        <div class="field">
          <div class="label">Email:</div>
          <div class="value"><a href="mailto:${email}">${email}</a></div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">🎓 Greek Organization</div>
        <div class="field">
          <div class="label">Organization:</div>
          <div class="value">${orgFullName}</div>
        </div>
        <div class="field">
          <div class="label">Chapter:</div>
          <div class="value">${chapterName}</div>
        </div>
        <div class="field">
          <div class="label">Location:</div>
          <div class="value">${city}, ${university}</div>
        </div>
        <div class="field">
          <div class="label">Line Name:</div>
          <div class="value">${lineName}</div>
        </div>
        <div class="field">
          <div class="label">Line Number:</div>
          <div class="value">#${lineNumber}</div>
        </div>
      </div>
      
      ${instagram || tiktok || facebook || twitter ? `
      <div class="section">
        <div class="section-title">📱 Social Media</div>
        ${instagram ? `<div class="field"><div class="label">Instagram:</div><div class="value"><a href="${instagram}">View Profile</a></div></div>` : ''}
        ${tiktok ? `<div class="field"><div class="label">TikTok:</div><div class="value"><a href="${tiktok}">View Profile</a></div></div>` : ''}
        ${facebook ? `<div class="field"><div class="label">Facebook:</div><div class="value"><a href="${facebook}">View Profile</a></div></div>` : ''}
        ${twitter ? `<div class="field"><div class="label">Twitter:</div><div class="value"><a href="${twitter}">View Profile</a></div></div>` : ''}
      </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">📸 Verification Status</div>
        <div class="field">
          <div class="label">Pari Image:</div>
          <div class="value"><span class="badge">${hasImage}</span></div>
        </div>
      </div>
      
      <center>
        <a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}" class="button">
          View All Submissions →
        </a>
      </center>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">Lettered Verification System</p>
      <p style="margin: 5px 0 0 0; font-size: 12px;">Automated notification</p>
    </div>
  </div>
</body>
</html>
`;
  
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: htmlBody
  });
  
  Logger.log('HTML email sent to ' + recipient);
}
```

Use the same trigger setup as Option A, but select `onFormSubmitAdvanced` instead.

---

## 🗂️ Pro Tip #3: Auto-Archive Old Submissions

Keep your main sheet clean by archiving old data automatically.

### Option A: Manual Monthly Archive (Easiest - 2 minutes)

#### Create Archive Template:

1. **At the end of each month:**
   - Go to your sheet
   - File → Make a copy
   - Name it: `Verifications Archive - [Month Year]` (e.g., "Verifications Archive - October 2025")

2. **Clean up main sheet:**
   - Select all rows except headers (row 1)
   - Right-click → Delete rows
   - Ready for next month!

### Option B: Automatic Archive Script (10 minutes)

Set up automatic archiving every month:

```javascript
function autoArchiveMonthly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName('Submissions');
  
  // Get current month/year for archive name
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const archiveName = 'Archive ' + Utilities.formatDate(lastMonth, Session.getScriptTimeZone(), 'MMMM yyyy');
  
  // Check if archive sheet already exists
  let archiveSheet = ss.getSheetByName(archiveName);
  
  if (!archiveSheet) {
    // Create new archive sheet
    archiveSheet = ss.insertSheet(archiveName);
    
    // Copy headers
    const headers = sourceSheet.getRange(1, 1, 1, sourceSheet.getLastColumn()).getValues();
    archiveSheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
    archiveSheet.getRange(1, 1, 1, headers[0].length).setFontWeight('bold');
    
    Logger.log('Created new archive: ' + archiveName);
  }
  
  // Get last month's data
  const dataRange = sourceSheet.getDataRange();
  const data = dataRange.getValues();
  const headers = data[0];
  
  const lastMonthData = data.filter((row, index) => {
    if (index === 0) return false; // Skip header
    
    const timestamp = new Date(row[0]);
    return timestamp.getMonth() === lastMonth.getMonth() && 
           timestamp.getFullYear() === lastMonth.getFullYear();
  });
  
  if (lastMonthData.length > 0) {
    // Append to archive
    const lastRow = archiveSheet.getLastRow();
    archiveSheet.getRange(lastRow + 1, 1, lastMonthData.length, lastMonthData[0].length)
      .setValues(lastMonthData);
    
    Logger.log(`Archived ${lastMonthData.length} submissions to ${archiveName}`);
    
    // Optional: Send summary email
    const recipient = 'your-email@gmail.com'; // ⬅️ CHANGE THIS
    const subject = `📦 Monthly Archive Created: ${archiveName}`;
    const body = `
Archive Summary
━━━━━━━━━━━━━━━━━━━━━━━━

Archive Name: ${archiveName}
Submissions Archived: ${lastMonthData.length}
Date: ${Utilities.formatDate(now, Session.getScriptTimeZone(), 'MMMM d, yyyy')}

View Archive:
${ss.getUrl()}#gid=${archiveSheet.getSheetId()}

━━━━━━━━━━━━━━━━━━━━━━━━
Lettered Verification System
`;
    
    MailApp.sendEmail(recipient, subject, body);
  } else {
    Logger.log('No data to archive for ' + archiveName);
  }
}

// Function to set up monthly trigger
function setupMonthlyArchive() {
  // Delete existing triggers for this function
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'autoArchiveMonthly') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger for 1st of each month at 2 AM
  ScriptApp.newTrigger('autoArchiveMonthly')
    .timeBased()
    .onMonthDay(1)
    .atHour(2)
    .create();
  
  Logger.log('Monthly archive trigger set up successfully!');
}
```

#### Setup Instructions:

1. Paste the code into Apps Script Editor
2. Change the email in `autoArchiveMonthly` function
3. Click **Save**
4. Run `setupMonthlyArchive` function once to create the trigger
5. The first of each month, archives will be created automatically!

### Option C: Archive with Data Retention (Advanced)

Keep only last 90 days in main sheet:

```javascript
function archiveOldData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName('Submissions');
  const archiveSheet = ss.getSheetByName('Full Archive') || ss.insertSheet('Full Archive');
  
  // Ensure archive has headers
  if (archiveSheet.getLastRow() === 0) {
    const headers = sourceSheet.getRange(1, 1, 1, sourceSheet.getLastColumn()).getValues();
    archiveSheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
  }
  
  const dataRange = sourceSheet.getDataRange();
  const data = dataRange.getValues();
  
  // Calculate cutoff date (90 days ago)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  
  const toArchive = [];
  const toKeep = [data[0]]; // Keep headers
  
  for (let i = 1; i < data.length; i++) {
    const timestamp = new Date(data[i][0]);
    
    if (timestamp < cutoffDate) {
      toArchive.push(data[i]);
    } else {
      toKeep.push(data[i]);
    }
  }
  
  if (toArchive.length > 0) {
    // Move old data to archive
    const lastRow = archiveSheet.getLastRow();
    archiveSheet.getRange(lastRow + 1, 1, toArchive.length, toArchive[0].length)
      .setValues(toArchive);
    
    // Update main sheet with only recent data
    sourceSheet.clearContents();
    sourceSheet.getRange(1, 1, toKeep.length, toKeep[0].length)
      .setValues(toKeep);
    
    Logger.log(`Archived ${toArchive.length} submissions older than 90 days`);
  }
}
```

Set up weekly trigger:
```javascript
ScriptApp.newTrigger('archiveOldData')
  .timeBased()
  .everyWeeks(1)
  .onWeekDay(ScriptApp.WeekDay.SUNDAY)
  .atHour(3)
  .create();
```

---

## 🎯 Summary

You now have:

✅ **Live Dashboard** - Real-time stats and charts
✅ **Email Alerts** - Instant notifications for new submissions
✅ **Auto-Archive** - Automatic data organization

## 📱 Bonus: Mobile App Setup

### Get Notifications on Your Phone:

1. Install **Google Sheets** app
2. Open your sheet
3. Tap the **bell icon** (top right)
4. Enable **"Notify me when any changes are made"**
5. Choose notification method (Email/Mobile)

Now you'll get push notifications for every new submission!

---

**Status**: Pro Tips Fully Implemented! 🚀

**Last Updated**: 2025-10-10

