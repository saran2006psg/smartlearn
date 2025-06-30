# VaaniPlus Backend Requirements

## Overview
This document outlines all backend services, APIs, databases, and third-party integrations required for the VaaniPlus educational platform.

## 1. Authentication & User Management

### Google OAuth Integration
- **Service**: Google Cloud Console OAuth 2.0
- **Required Setup**:
  - Create Google Cloud Project
  - Enable Google+ API
  - Configure OAuth consent screen
  - Generate Client ID and Client Secret
- **Environment Variables**:
  ```
  VITE_GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  ```

### User Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_image TEXT,
  role ENUM('student', 'teacher', 'parent', 'hr') DEFAULT 'student',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User sessions
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 2. Content Management System

### Lessons Database
```sql
-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('math', 'science', 'alphabets', 'numbers', 'sentences'),
  level ENUM('beginner', 'intermediate', 'advanced'),
  duration INTEGER, -- in minutes
  video_url TEXT,
  avatar_data JSONB,
  content JSONB, -- lesson content structure
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completion_percentage INTEGER DEFAULT 0,
  score INTEGER,
  time_spent INTEGER, -- in seconds
  last_accessed TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);
```

## 3. AI & Machine Learning Services

### Text-to-ISL Translation API
- **Service**: Custom ML Model or Third-party API
- **Requirements**:
  - Natural Language Processing for text analysis
  - ISL gesture mapping database
  - 3D animation generation
- **API Endpoints**:
  ```
  POST /api/translate
  {
    "text": "Hello world",
    "source_language": "en",
    "target_language": "isl"
  }
  ```

### Handwriting Recognition API
- **Service**: Google Cloud Vision API or Custom ML Model
- **Requirements**:
  - Image processing for canvas drawings
  - OCR for text recognition
  - Multi-language support
- **API Endpoints**:
  ```
  POST /api/recognize-text
  {
    "image": "base64_encoded_image",
    "language": "hi"
  }
  ```

### 3D Avatar Generation
- **Service**: Custom 3D rendering service
- **Requirements**:
  - Three.js backend rendering
  - ISL gesture animation library
  - Real-time avatar generation
- **API Endpoints**:
  ```
  POST /api/generate-avatar
  {
    "text": "Hello",
    "animation_style": "realistic",
    "speed": "normal"
  }
  ```

## 4. File Storage & CDN

### Media Storage
- **Service**: AWS S3 or Google Cloud Storage
- **Requirements**:
  - Video file storage for lessons
  - Image storage for user profiles
  - 3D model and animation files
  - Canvas drawings and exports

### CDN Configuration
- **Service**: CloudFlare or AWS CloudFront
- **Purpose**: Fast delivery of static assets globally

## 5. Real-time Features

### WebSocket Server
- **Purpose**: Real-time collaboration features
- **Use Cases**:
  - Live translation sessions
  - Teacher-student interactions
  - Progress updates

## 6. Analytics & Monitoring

### Learning Analytics Database
```sql
-- User activity tracking
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  activity_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Performance metrics
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_type VARCHAR(100) NOT NULL,
  value DECIMAL,
  date DATE DEFAULT CURRENT_DATE
);
```

## 7. Translation History

### Translation Storage
```sql
-- Translation history
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  source_language VARCHAR(10),
  target_language VARCHAR(10) DEFAULT 'isl',
  translated_content JSONB,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 8. API Rate Limiting & Security

### Rate Limiting
- **Service**: Redis for rate limiting
- **Limits**:
  - Translation API: 100 requests/hour per user
  - Text recognition: 50 requests/hour per user
  - File uploads: 20 requests/hour per user

### Security Requirements
- JWT token authentication
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 9. Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/vaaniplus
REDIS_URL=redis://localhost:6379

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret

# AI Services
OPENAI_API_KEY=your_openai_key (if using GPT for translations)
GOOGLE_VISION_API_KEY=your_vision_api_key

# File Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=vaaniplus-storage

# External APIs
TRANSLATION_API_URL=your_translation_service_url
AVATAR_GENERATION_API_URL=your_avatar_service_url
```

## 10. Deployment Requirements

### Server Infrastructure
- **Minimum**: 2 CPU cores, 4GB RAM, 50GB storage
- **Recommended**: 4 CPU cores, 8GB RAM, 100GB storage
- **Database**: PostgreSQL 14+
- **Cache**: Redis 6+

### Docker Configuration
```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 11. Third-party Service Integrations

### Required API Keys and Services
1. **Google Cloud Platform**
   - OAuth 2.0 credentials
   - Vision API for text recognition
   - Cloud Storage for file hosting

2. **OpenAI** (Optional)
   - GPT API for enhanced translations
   - DALL-E for avatar customization

3. **AWS Services** (Alternative to Google)
   - S3 for file storage
   - Rekognition for image analysis

4. **Monitoring Services**
   - Sentry for error tracking
   - Google Analytics for usage metrics

## 12. Development Setup Instructions

### Local Development
1. Set up PostgreSQL database
2. Install Redis server
3. Configure environment variables
4. Run database migrations
5. Start backend server
6. Configure frontend environment variables

### Testing Requirements
- Unit tests for all API endpoints
- Integration tests for AI services
- Load testing for translation APIs
- Security testing for authentication

## 13. Backup & Recovery

### Database Backups
- Daily automated backups
- Point-in-time recovery capability
- Cross-region backup storage

### File Storage Backups
- Versioning enabled on S3/Cloud Storage
- Regular backup verification
- Disaster recovery procedures

This document should be updated as new features are added or requirements change.

## Next Steps

1. **Start your dev server:**
   ```
   npm run dev
   ```
2. **Open your app in the browser.**
3. **Try the “Sign in with Google” button.**
   - You should be redirected to the dashboard after login.