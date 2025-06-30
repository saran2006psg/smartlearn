# API Keys and External Services Setup Guide

## Required API Keys and Services

### 1. Google Cloud Platform Setup

#### Google OAuth 2.0
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure OAuth consent screen
6. Add authorized origins: `http://localhost:5173`, `https://yourdomain.com`
7. Copy Client ID and Client Secret

#### Google Vision API (for text recognition)
1. Enable Cloud Vision API in Google Cloud Console
2. Create service account credentials
3. Download JSON key file
4. Set environment variable: `GOOGLE_APPLICATION_CREDENTIALS`

### 2. OpenAI API (Optional - for enhanced AI features)
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Generate API key from dashboard
3. Set usage limits and billing
4. Use for: Enhanced translations, content generation

### 3. AWS Services (Alternative to Google)

#### AWS S3 for File Storage
1. Create AWS account
2. Create S3 bucket for file storage
3. Generate IAM user with S3 permissions
4. Get Access Key ID and Secret Access Key

#### AWS Rekognition (Alternative to Google Vision)
1. Enable Amazon Rekognition service
2. Configure IAM permissions
3. Use for image and text recognition

### 4. Database Services

#### Supabase (Recommended for quick setup)
1. Sign up at [Supabase](https://supabase.com/)
2. Create new project
3. Get database URL and API keys
4. Configure Row Level Security

#### PostgreSQL (Self-hosted alternative)
1. Install PostgreSQL 14+
2. Create database and user
3. Configure connection string

### 5. Redis (for caching and rate limiting)
1. Install Redis locally or use Redis Cloud
2. Get connection URL
3. Configure for session storage and caching

### 6. Monitoring and Analytics

#### Sentry (Error Tracking)
1. Sign up at [Sentry](https://sentry.io/)
2. Create new project
3. Get DSN for error reporting

#### Google Analytics
1. Create GA4 property
2. Get Measurement ID
3. Configure for user analytics

### 7. Email Service (for notifications)

#### SendGrid
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify sender identity
3. Generate API key

#### Alternative: AWS SES
1. Set up Amazon SES
2. Verify email domains
3. Configure SMTP credentials

## Environment Variables Template

Create a `.env` file with these variables:

```env
# Frontend Environment Variables
VITE_GOOGLE_CLIENT_ID=26523042977-lnjg7thulco3lhjiqmb1r9g6cvr9p9u1.apps.googleusercontent.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_key (optional)

# Backend Environment Variables (when you set up backend)
DATABASE_URL=postgresql://username:password@localhost:5432/vaaniplus
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_SECRET=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
GOOGLE_APPLICATION_CREDENTIALS=path/to/google-credentials.json
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=vaaniplus-storage
SENDGRID_API_KEY=your_sendgrid_api_key
SENTRY_DSN=your_sentry_dsn
```

## Cost Estimates (Monthly)

### Free Tier Options
- **Google Cloud**: $0 (within free limits)
- **Supabase**: $0 (up to 50MB database)
- **OpenAI**: $0 (with usage limits)
- **Sentry**: $0 (up to 5K errors/month)

### Paid Tier Estimates
- **Google Cloud**: $10-50/month (depending on usage)
- **Supabase Pro**: $25/month
- **OpenAI**: $20-100/month (based on API calls)
- **AWS S3**: $5-20/month (storage costs)
- **SendGrid**: $15/month (for email service)

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all secrets**
3. **Rotate API keys regularly**
4. **Set up proper CORS policies**
5. **Enable rate limiting on all APIs**
6. **Use HTTPS in production**
7. **Implement proper authentication flows**

## Testing API Keys

### Google OAuth Test
```javascript
// Test Google OAuth integration
const testGoogleAuth = () => {
  console.log('Google Client ID:', process.env.VITE_GOOGLE_CLIENT_ID);
  // Should not be undefined
};
```

### Database Connection Test
```javascript
// Test database connection
const testDatabase = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count');
    console.log('Database connected:', !error);
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};
```

## Next Steps After Getting API Keys

1. **Update environment variables** in your project
2. **Test each integration** individually
3. **Set up monitoring** and error tracking
4. **Configure rate limiting** for production
5. **Set up automated backups** for database
6. **Implement proper logging** for debugging

## Support and Documentation

- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [AWS Documentation](https://docs.aws.amazon.com/)

Remember to keep all API keys secure and never share them publicly!