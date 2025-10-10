// Verification Form Submission Handler
// This serverless function handles verification form submissions securely

// Import necessary modules
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Rate limiting storage (in production, use Redis or a database)
const submissions = new Map();

// Clean up old submissions every hour
setInterval(() => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    for (const [key, timestamp] of submissions.entries()) {
        if (now - timestamp > fiveMinutes) {
            submissions.delete(key);
        }
    }
}, 60 * 60 * 1000);

// Email configuration (using environment variables)
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Upload image to Google Drive
async function uploadToGoogleDrive(imageData, fileName, email) {
    try {
        if (!process.env.GOOGLE_SHEETS_CREDENTIALS || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
            console.log('Google Drive not configured, skipping image upload...');
            return null;
        }

        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
        
        // Create auth client with Drive scope
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive.file'
            ],
        });

        const drive = google.drive({ version: 'v3', auth });

        // Convert base64 to buffer
        const base64Data = imageData.data.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // Create unique filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
        const uniqueFileName = `${timestamp}_${sanitizedEmail}_${fileName}`;

        // Upload file to Drive
        const fileMetadata = {
            name: uniqueFileName,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
        };

        const media = {
            mimeType: imageData.type,
            body: require('stream').Readable.from(buffer)
        };

        const file = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink'
        });

        // Make file accessible via link
        await drive.permissions.create({
            fileId: file.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        console.log('Image uploaded to Google Drive:', file.data.webViewLink);
        return file.data.webViewLink;

    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        return null;
    }
}

// Write data to Google Sheets
async function writeToGoogleSheets(data, imageUrl) {
    try {
        // Check if Google Sheets is configured
        if (!process.env.GOOGLE_SHEETS_CREDENTIALS || !process.env.GOOGLE_SHEET_ID) {
            console.log('Google Sheets not configured, skipping...');
            return { success: false, message: 'Google Sheets not configured' };
        }

        // Parse credentials from environment variable
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
        
        // Create auth client
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // Prepare row data
        const row = [
            new Date(data.timestamp).toLocaleString(), // Timestamp
            data.fname,
            data.lname,
            data.email,
            data.organization,
            data.chapterName,
            data.city,
            data.university,
            data.lineName,
            data.lineNumber,
            data.socialMedia.instagram || '',
            data.socialMedia.tiktok || '',
            data.socialMedia.facebook || '',
            data.socialMedia.twitter || '',
            imageUrl || 'No Image', // Google Drive link or "No Image"
            data.submittedFrom,
            data.userAgent
        ];

        // Append row to sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:Q', // Adjust sheet name if needed
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [row],
            },
        });

        console.log('Successfully wrote to Google Sheets');
        return { success: true };
    } catch (error) {
        console.error('Error writing to Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

// Main handler function
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });
    }

    try {
        const data = req.body;

        // Server-side validation
        if (!data.fname || !data.lname || !data.email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields' 
            });
        }

        // Validate email
        if (!isValidEmail(data.email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email address' 
            });
        }

        // Rate limiting by IP address
        const clientIP = req.headers['x-forwarded-for'] || 
                        req.headers['x-real-ip'] || 
                        req.connection.remoteAddress;
        
        const now = Date.now();
        const lastSubmission = submissions.get(clientIP);
        
        if (lastSubmission && (now - lastSubmission) < 300000) { // 5 minutes
            const remainingTime = Math.ceil((300000 - (now - lastSubmission)) / 60000);
            return res.status(429).json({ 
                success: false, 
                error: `Please wait ${remainingTime} minute(s) before submitting again` 
            });
        }

        // Sanitize all text inputs
        const sanitizedData = {
            fname: sanitizeInput(data.fname),
            lname: sanitizeInput(data.lname),
            email: sanitizeInput(data.email),
            organization: sanitizeInput(data.organization),
            chapterName: sanitizeInput(data.chapterName),
            city: sanitizeInput(data.city),
            university: sanitizeInput(data.university),
            lineName: sanitizeInput(data.lineName),
            lineNumber: data.lineNumber,
            socialMedia: {
                instagram: sanitizeInput(data.socialMedia?.instagram || ''),
                tiktok: sanitizeInput(data.socialMedia?.tiktok || ''),
                facebook: sanitizeInput(data.socialMedia?.facebook || ''),
                twitter: sanitizeInput(data.socialMedia?.twitter || '')
            },
            timestamp: data.timestamp,
            userAgent: sanitizeInput(data.userAgent || ''),
            submittedFrom: clientIP
        };

        // Store submission timestamp
        submissions.set(clientIP, now);

        // Prepare email content
        const emailHtml = `
            <h2>New Verification Request</h2>
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> ${sanitizedData.fname} ${sanitizedData.lname}</p>
            <p><strong>Email:</strong> ${sanitizedData.email}</p>
            
            <h3>Greek Information</h3>
            <p><strong>Organization:</strong> ${sanitizedData.organization}</p>
            <p><strong>Chapter Name:</strong> ${sanitizedData.chapterName}</p>
            <p><strong>City:</strong> ${sanitizedData.city}</p>
            <p><strong>University:</strong> ${sanitizedData.university}</p>
            <p><strong>Line Name:</strong> ${sanitizedData.lineName}</p>
            <p><strong>Line Number:</strong> ${sanitizedData.lineNumber}</p>
            
            <h3>Social Media</h3>
            <p><strong>Instagram:</strong> ${sanitizedData.socialMedia.instagram || 'Not provided'}</p>
            <p><strong>TikTok:</strong> ${sanitizedData.socialMedia.tiktok || 'Not provided'}</p>
            <p><strong>Facebook:</strong> ${sanitizedData.socialMedia.facebook || 'Not provided'}</p>
            <p><strong>Twitter:</strong> ${sanitizedData.socialMedia.twitter || 'Not provided'}</p>
            
            <h3>Submission Details</h3>
            <p><strong>Submitted:</strong> ${new Date(sanitizedData.timestamp).toLocaleString()}</p>
            <p><strong>IP Address:</strong> ${sanitizedData.submittedFrom}</p>
            <p><strong>User Agent:</strong> ${sanitizedData.userAgent}</p>
            
            ${data.pariImage ? '<p><strong>Note:</strong> Pari image attached</p>' : ''}
        `;

        // Send email notification
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transporter = createTransporter();
            
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
                subject: `New Verification Request - ${sanitizedData.fname} ${sanitizedData.lname}`,
                html: emailHtml,
                attachments: data.pariImage ? [{
                    filename: data.pariImage.name,
                    content: data.pariImage.data.split(',')[1],
                    encoding: 'base64'
                }] : []
            };

            await transporter.sendMail(mailOptions);
        }

        // Upload image to Google Drive (if present)
        let imageUrl = null;
        if (data.pariImage) {
            imageUrl = await uploadToGoogleDrive(data.pariImage, data.pariImage.name, sanitizedData.email);
        }

        // Store in Google Sheets with image URL
        await writeToGoogleSheets(sanitizedData, imageUrl);

        // Log submission (for debugging - remove in production)
        console.log('Verification submitted:', {
            email: sanitizedData.email,
            timestamp: sanitizedData.timestamp
        });

        // Return success response
        return res.status(200).json({ 
            success: true, 
            message: 'Verification submitted successfully' 
        });

    } catch (error) {
        console.error('Error processing verification:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
};

