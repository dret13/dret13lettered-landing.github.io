// Quick test script to validate your JSON credentials
// Run: node test-json.js

// Paste your minified JSON here between the backticks
const jsonString = `
PASTE_YOUR_MINIFIED_JSON_HERE
`;

try {
    const credentials = JSON.parse(jsonString.trim());
    console.log('✅ JSON is VALID!');
    console.log('Service Account Email:', credentials.client_email);
    console.log('Project ID:', credentials.project_id);
    console.log('\nYou can safely use this in Vercel!');
} catch (error) {
    console.log('❌ JSON is INVALID!');
    console.log('Error:', error.message);
    console.log('\nFix the JSON and try again.');
}

