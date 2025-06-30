# SmartLearn - Setup & Running Guide

A complete guide to set up and run the SmartLearn educational platform.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### Step-by-Step Setup

#### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd smartlearn

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### 2. Set up PostgreSQL Database

1. **Install PostgreSQL**
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Install with default settings
   - Remember the password you set for the `postgres` user

2. **Verify PostgreSQL is Running**
   ```bash
   # Windows - Check services
   services.msc
   # Look for "postgresql-x64-XX" and ensure it's running
   
   # Or check ports
   netstat -an | findstr :5432
   ```

#### 3. Configure Environment Variables

**Create Frontend Environment (.env in root directory):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Create Backend Environment (.env in backend directory):**
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

# Google OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Important:** Replace `your_postgres_password_here` with your actual PostgreSQL password.

#### 4. Set up Database

```bash
cd backend
npm run setup-db
```

This will:
- Create the `smartlearn_db` database
- Create all necessary tables
- Insert sample data
- Test the connection

## 🏃‍♂️ Running the Application

### Option 1: Manual Setup (Recommended for Development)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

### Option 2: Quick Start Script (Windows)

```bash
# Run the batch file
quick-start.bat
```

### Option 3: Production Mode

**Backend:**
```bash
cd backend
npm run start
```

**Frontend:**
```bash
npm run build
npm run preview
```

## 🌐 Access Your Application

Once both servers are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## 🔧 Available Scripts

### Frontend Scripts (in root directory)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts (in backend directory)
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run setup-db     # Set up database tables
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Error
**Error:** `password authentication failed for user "postgres"`

**Solution:**
- Check if PostgreSQL is running
- Verify password in `backend/.env` file
- Test connection manually:
  ```bash
  # Windows
  "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost
  ```

#### 2. Port Already in Use
**Error:** `EADDRINUSE: address already in use`

**Solution:**
- Change ports in `.env` files
- Kill processes using the ports:
  ```bash
  # Find processes
  netstat -ano | findstr :5000
  netstat -ano | findstr :5173
  
  # Kill process (replace PID with actual process ID)
  taskkill /PID <PID> /F
  ```

#### 3. CORS Errors
**Error:** `Access to fetch at 'http://localhost:5000/api' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**
- Check `FRONTEND_URL` in backend `.env` file
- Ensure it matches your frontend URL exactly
- Restart backend server after changes

#### 4. Module Not Found
**Error:** `Cannot find module 'xxx'`

**Solution:**
- Reinstall dependencies:
  ```bash
  # Frontend
  rm -rf node_modules package-lock.json
  npm install
  
  # Backend
  cd backend
  rm -rf node_modules package-lock.json
  npm install
  ```

#### 5. PostgreSQL Not Running
**Error:** `ECONNREFUSED: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
- Start PostgreSQL service:
  ```bash
  # Windows
  net start postgresql-x64-17
  
  # Or through Services
  services.msc
  # Find PostgreSQL and start it
  ```

### Health Checks

Test if everything is working:

```bash
# Test backend
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:5173

# Test database (if psql is in PATH)
psql -U postgres -h localhost -d smartlearn_db -c "SELECT COUNT(*) FROM users;"
```

### Expected Outputs

**Backend Health Check:**
```json
{
  "status": "OK",
  "message": "SmartLearn Backend is running!",
  "timestamp": "2025-06-26T19:47:46.884Z"
}
```

**Database Setup Success:**
```
🚀 Setting up SmartLearn database...
✅ Database already exists!
📋 Initializing database schema...
✅ Database schema initialized successfully!
📊 Database test successful! Found 0 users.
🎉 Database setup completed successfully!
```

## 📁 Project Structure

```
smartlearn/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── stores/            # State management
│   └── types/             # TypeScript types
├── backend/               # Backend Node.js application
│   ├── config/            # Database configuration
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── server.js          # Main server file
├── .env                   # Frontend environment variables
└── package.json           # Frontend dependencies
```

## 🔐 Authentication Setup

### Google OAuth (Optional)

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google+ API

2. **Configure OAuth Consent Screen**
   - Add your domain
   - Add scopes for email and profile

3. **Create OAuth 2.0 Credentials**
   - Create OAuth 2.0 Client ID
   - Add authorized origins: `http://localhost:5173`
   - Add authorized redirect URIs: `http://localhost:5173`

4. **Update Environment Variables**
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

## 🚀 Production Deployment

### Environment Variables for Production

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

**Backend (.env.production):**
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
DB_PASSWORD=your_secure_production_password
JWT_SECRET=your_very_secure_jwt_secret
```

### Build Commands

```bash
# Frontend
npm run build

# Backend
cd backend
npm run start
```

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Verify all prerequisites are installed**
3. **Check the logs in both terminal windows**
4. **Ensure all environment variables are set correctly**
5. **Test each component individually**

### Useful Commands for Debugging

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL version
psql --version

# Check if ports are in use
netstat -an | findstr ":5000\|:5173"

# Check running processes
tasklist | findstr node
```

---

**Happy Learning! 🎓** 