#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Google OAuth Setup for VaaniPlus\n');
console.log('This script will help you configure Google OAuth for your application.\n');

console.log('📋 Prerequisites:');
console.log('1. You need a Google Cloud Project');
console.log('2. Google+ API must be enabled');
console.log('3. OAuth consent screen must be configured');
console.log('4. OAuth 2.0 credentials must be created\n');

console.log('🌐 If you haven\'t set up Google OAuth yet, follow these steps:');
console.log('1. Go to https://console.cloud.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable Google+ API (APIs & Services > Library > Google+ API)');
console.log('4. Configure OAuth consent screen (APIs & Services > OAuth consent screen)');
console.log('5. Create OAuth 2.0 credentials (APIs & Services > Credentials)');
console.log('6. Add authorized origins: http://localhost:5173');
console.log('7. Copy your Client ID\n');

rl.question('Enter your Google OAuth Client ID: ', (clientId) => {
  if (!clientId || clientId.trim() === '') {
    console.log('❌ Client ID is required. Please run this script again with a valid Client ID.');
    rl.close();
    return;
  }

  // Validate Client ID format
  const clientIdPattern = /^\d+-\w+\.apps\.googleusercontent\.com$/;
  if (!clientIdPattern.test(clientId.trim())) {
    console.log('⚠️  Warning: Client ID format doesn\'t match expected pattern.');
    console.log('Expected format: 123456789-abcdefghijklmnop.apps.googleusercontent.com');
    console.log('Continue anyway? (y/n): ');
    
    rl.question('', (answer) => {
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Setup cancelled.');
        rl.close();
        return;
      }
      updateEnvFile(clientId.trim());
    });
  } else {
    updateEnvFile(clientId.trim());
  }
});

function updateEnvFile(clientId) {
  const envContent = `# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=${clientId}

# Development server URL
VITE_DEV_SERVER_URL=http://localhost:5173
`;

  try {
    fs.writeFileSync('.env', envContent);
    console.log('✅ .env file updated successfully!');
    console.log('🔧 Next steps:');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Test the Google login functionality');
    console.log('3. If you get errors, check the Google Cloud Console settings');
    console.log('\n📖 For detailed setup instructions, see GOOGLE_OAUTH_SETUP.md');
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
  }
  
  rl.close();
} 