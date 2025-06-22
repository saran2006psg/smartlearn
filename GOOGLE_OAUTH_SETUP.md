# Google OAuth Setup Guide

This guide will help you set up Google OAuth for the VaaniPlus application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "VaaniPlus")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity Services"
3. Click on it and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - App name: "VaaniPlus"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. Skip scopes section and click "Save and Continue"
6. Add test users if needed, then click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Name: "VaaniPlus Web Client"
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (if using different port)
   - Your production domain (when deployed)
6. Add authorized redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:3000`
   - Your production domain
7. Click "Create"

## Step 5: Get Your Client ID

1. After creating the OAuth client, you'll see a popup with your Client ID
2. Copy the Client ID (it looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

## Step 6: Update Your Application

1. Open `src/App.tsx`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:

```typescript
const GOOGLE_CLIENT_ID = "123456789-abcdefghijklmnop.apps.googleusercontent.com";
```

## Step 7: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your application
3. You should be redirected to the login page
4. Click "Sign in with Google"
5. Complete the Google OAuth flow
6. You should be redirected to the dashboard after successful authentication

## Environment Variables (Recommended)

For better security, you can use environment variables:

1. Create a `.env` file in your project root:
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

2. Update `src/App.tsx`:
```typescript
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
```

## Troubleshooting

### Common Issues:

1. **"Invalid Client ID" error**
   - Make sure you've copied the correct Client ID
   - Ensure the domain is added to authorized origins

2. **"Redirect URI mismatch" error**
   - Add your exact domain to authorized redirect URIs
   - Include both `http://` and `https://` versions if needed

3. **"OAuth consent screen not configured" error**
   - Complete the OAuth consent screen setup
   - Add test users if using external user type

4. **"API not enabled" error**
   - Enable the Google+ API or Google Identity Services API

### Security Notes:

- Never commit your Client ID to public repositories
- Use environment variables for production
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in Google Cloud Console

## Production Deployment

When deploying to production:

1. Add your production domain to authorized origins
2. Add your production domain to redirect URIs
3. Update the OAuth consent screen with production information
4. Use environment variables for the Client ID
5. Consider using a custom domain for better security

## Support

If you encounter issues:
1. Check the Google Cloud Console for error messages
2. Verify all configuration steps are completed
3. Check browser console for JavaScript errors
4. Ensure your domain is properly configured 