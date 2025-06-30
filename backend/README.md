# SmartLearn Backend API

This is the backend API for the SmartLearn educational platform, built with Node.js, Express, and PostgreSQL.

## Features

- 🔐 **Authentication**: Google OAuth integration with JWT tokens
- 📚 **Lesson Management**: CRUD operations for educational content
- 📊 **Progress Tracking**: User learning progress and analytics
- 🔄 **Translation API**: Text-to-ISL translation with history
- 👥 **User Management**: Profile management and role-based access
- 📈 **Analytics**: Learning statistics and performance metrics

## Prerequisites

Before running this backend, you need to install:

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v12 or higher)

### Installing PostgreSQL on Windows

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. PostgreSQL will be installed on port 5432 by default

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy the example environment file:
```bash
copy env.example .env
```

2. Edit `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartlearn_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Database Setup

1. **Create Database**:
   - Open pgAdmin (comes with PostgreSQL)
   - Connect to your PostgreSQL server
   - Right-click on "Databases" → "Create" → "Database"
   - Name it `smartlearn_db`

2. **Initialize Database**:
   ```bash
   # Connect to PostgreSQL and run the initialization script
   psql -U postgres -d smartlearn_db -f config/init-db.sql
   ```

   Or manually run the SQL commands from `config/init-db.sql` in pgAdmin.

### 4. Start the Server

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update user preferences

### Lessons
- `GET /api/lessons` - Get all lessons (with filtering)
- `GET /api/lessons/:id` - Get specific lesson
- `POST /api/lessons` - Create new lesson (teacher/admin)
- `PUT /api/lessons/:id` - Update lesson (teacher/admin)
- `DELETE /api/lessons/:id` - Delete lesson (teacher/admin)
- `POST /api/lessons/:id/progress` - Update lesson progress

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/progress` - Get user progress summary
- `GET /api/users/stats` - Get user statistics

### Translations
- `POST /api/translations/translate` - Translate text to ISL
- `GET /api/translations/history` - Get translation history
- `DELETE /api/translations/history/:id` - Delete translation from history
- `GET /api/translations/stats` - Get translation statistics

### Progress
- `GET /api/progress/overview` - Get overall progress
- `GET /api/progress/by-category` - Get progress by category
- `GET /api/progress/by-level` - Get progress by level
- `GET /api/progress/recent-activity` - Get recent activity
- `GET /api/progress/timeline` - Get learning timeline
- `GET /api/progress/performance` - Get performance metrics
- `GET /api/progress/achievements` - Get user achievements

## Database Schema

The database includes the following main tables:

- **users** - User accounts and profiles
- **user_sessions** - JWT token sessions
- **lessons** - Educational content
- **user_progress** - Learning progress tracking
- **translations** - Translation history
- **user_activities** - User activity logging
- **performance_metrics** - Performance analytics

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error information (in development)"
}
```

## Development

### Project Structure
```
backend/
├── config/
│   ├── database.js          # Database connection
│   └── init-db.sql          # Database initialization
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── lessons.js           # Lesson management
│   ├── users.js             # User management
│   ├── translations.js      # Translation API
│   └── progress.js          # Progress tracking
├── server.js                # Main server file
├── package.json
└── README.md
```

### Adding New Features

1. Create new route files in the `routes/` directory
2. Add middleware in the `middleware/` directory
3. Update `server.js` to include new routes
4. Add any new database tables to `config/init-db.sql`

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check if PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database `smartlearn_db` exists

2. **Port Already in Use**:
   - Change the PORT in `.env` file
   - Or kill the process using the port

3. **JWT Token Issues**:
   - Check JWT_SECRET in `.env`
   - Ensure token is properly formatted in Authorization header

### Logs

The server uses Morgan for HTTP request logging. Check the console for:
- Request logs
- Database connection status
- Error messages

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a strong JWT_SECRET
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use a process manager like PM2
6. Configure database connection pooling
7. Set up proper logging and monitoring

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check server logs for error details
4. Verify database connectivity 