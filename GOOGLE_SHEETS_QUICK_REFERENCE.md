# Google Sheets Quick Reference Card

Quick copy-paste formulas and scripts for your Lettered verification system.

## 📊 Dashboard Formulas (Quick Copy)

### Basic Stats
```
Total Submissions:
=COUNTA(Submissions!A:A)-1

Today:
=COUNTIF(Submissions!A:A,">="&TEXT(TODAY(),"M/d/yyyy"))

This Week:
=COUNTIF(Submissions!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY())+1,"M/d/yyyy"))

This Month:
=COUNTIF(Submissions!A:A,">="&TEXT(EOMONTH(TODAY(),-1)+1,"M/d/yyyy"))
```

### Organization Counts
```
Alpha Phi Alpha: =COUNTIF(Submissions!E:E,"alpha")
Alpha Kappa Alpha: =COUNTIF(Submissions!E:E,"aka")
Kappa Alpha Psi: =COUNTIF(Submissions!E:E,"kappa")
Omega Psi Phi: =COUNTIF(Submissions!E:E,"que")
Delta Sigma Theta: =COUNTIF(Submissions!E:E,"delta")
Phi Beta Sigma: =COUNTIF(Submissions!E:E,"sigma")
Sigma Gamma Rho: =COUNTIF(Submissions!E:E,"sgrho")
Zeta Phi Beta: =COUNTIF(Submissions!E:E,"zeta")
Iota Phi Theta: =COUNTIF(Submissions!E:E,"iota")
```

### Additional Stats
```
With Image:
=COUNTIF(Submissions!O:O,"Yes")

Without Image:
=COUNTIF(Submissions!O:O,"No")

Last Submission:
=MAX(Submissions!A:A)

Average Submissions Per Day:
=COUNTA(Submissions!A:A)/DAYS(TODAY(),MIN(Submissions!A:A))
```

## 📧 Email Alert Script (Minimal Version)

```javascript
function onFormSubmit() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Submissions');
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(lastRow, 1, 1, 17).getValues()[0];
  
  const recipient = 'YOUR_EMAIL@gmail.com'; // ⬅️ CHANGE THIS
  const subject = `New Verification: ${data[1]} ${data[2]}`;
  const body = `
New submission from ${data[1]} ${data[2]}
Email: ${data[3]}
Organization: ${data[4]}
Chapter: ${data[5]}

View: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
`;
  
  MailApp.sendEmail(recipient, subject, body);
}
```

**To use:**
1. Extensions → Apps Script
2. Paste code above
3. Change email address
4. Save
5. Set trigger: Clock icon → Add Trigger → On change

## 🗂️ Quick Archive Script

```javascript
function quickArchive() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const source = ss.getSheetByName('Submissions');
  const archiveName = 'Archive ' + new Date().toLocaleDateString();
  
  source.copyTo(ss).setName(archiveName);
  
  MailApp.sendEmail(
    'YOUR_EMAIL@gmail.com', // ⬅️ CHANGE THIS
    'Archive Created',
    `Created archive: ${archiveName}`
  );
}
```

**To use:**
Run this function manually whenever you want to create an archive.

## 🎨 Conditional Formatting Quick Setup

### Highlight "Yes" in Has Image column:
1. Select column O
2. Format → Conditional formatting
3. Format cells if: Text is exactly → `Yes`
4. Formatting style: Green background

### Highlight by Organization:
1. Select column E (Organization)
2. Format → Conditional formatting
3. Add multiple rules:
   - `alpha` → Blue background
   - `aka` → Pink background
   - `delta` → Red background
   - (etc.)

## 📱 Useful Column References

```
A = Timestamp
B = First Name
C = Last Name
D = Email
E = Organization
F = Chapter Name
G = City
H = University
I = Line Name
J = Line Number
K = Instagram
L = TikTok
M = Facebook
N = Twitter
O = Has Image
P = IP Address
Q = User Agent
```

## 🔍 Useful Filter Views

### View Today's Submissions:
```
Filter condition for Column A:
Greater than or equal to: =TODAY()
```

### View Pending (No Image):
```
Filter condition for Column O:
Text is exactly: No
```

### View by Organization:
```
Filter condition for Column E:
Text contains: alpha (or aka, delta, etc.)
```

## 💡 Pro Tips

### Quick Sum Formula:
```
Total Alpha submissions this month:
=COUNTIFS(Submissions!E:E,"alpha",Submissions!A:A,">="&EOMONTH(TODAY(),-1)+1)
```

### Find Duplicates:
```
In column R, add formula to check for duplicate emails:
=IF(COUNTIF($D$2:$D,D2)>1,"DUPLICATE","")
```

### Auto-Number Rows:
```
In column A (if not using timestamp):
=ROW()-1
```

### Lookup Member Info:
```
Find member by email:
=VLOOKUP("email@example.com",Submissions!A:Q,2,FALSE)
```

## 🚨 Common Issues & Quick Fixes

**Formulas showing #REF!**
- Check if sheet name is "Submissions" (not "Sheet1")
- Update formula references

**Email not sending**
- Check recipient email address
- Verify trigger is set up
- Check script authorization

**Dashboard not updating**
- Press Ctrl+R (or Cmd+R) to refresh
- Check formulas reference correct sheet name

**Archive script failing**
- Verify sheet names match code
- Check permissions in Apps Script

## 📞 Quick Commands

**Refresh all data:** `Ctrl + R` (Windows) or `Cmd + R` (Mac)

**Open Apps Script:** `Extensions → Apps Script`

**View Triggers:** In Apps Script, click clock icon

**Check Logs:** In Apps Script, `View → Logs` or `Ctrl + Enter`

**Test Email:** Run function then check `View → Logs`

---

**Keep this handy for quick reference!** 📌

**Last Updated**: 2025-10-10

