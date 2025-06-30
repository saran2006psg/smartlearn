# SmartLearn Complete Setup Guide

This guide will walk you through setting up the entire SmartLearn educational platform from scratch, including both frontend and backend.

## 🎯 What You'll Build

SmartLearn is a comprehensive educational platform with:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + PostgreSQL
- **Features**: Google OAuth, lesson management, progress tracking, translation tools

## 📋 Prerequisites

Before starting, make sure you have:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
3. **Git** - [Download here](https://git-scm.com/)

## 🚀 Step-by-Step Setup

### Step 1: Install PostgreSQL

1. **Download PostgreSQL**:
   - Go to https://www.postgresql.org/download/windows/
   - Download the latest version for Windows
   - Run the installer

2. **Installation Setup**:
   - Choose your installation directory
   - Set a password for the `postgres` user (remember this!)
   - Keep the default port (5432)
   - Install all components when prompted

3. **Verify Installation**:
   - Open Command Prompt
   - Run: `psql --version`
   - You should see PostgreSQL version information

### Step 2: Setup Environment Variables

1. **Create backend environment file**:
   ```bash
   cd backend
   copy env.example .env
   ```

2. **Edit the `.env` file** with your settings:
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
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRES_IN=7d

   # Google OAuth Configuration (we'll set this up later)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Create frontend environment file**:
   ```bash
   cd ..
   # Create .env file in the root directory
   echo VITE_API_URL=http://localhost:5000/api > .env
   ```

### Step 3: Setup Database

1. **Run the database setup script**:
   ```bash
   cd backend
   npm run setup-db
   ```

   This will:
   - Create the `smartlearn_db` database
   - Initialize all tables
   - Insert sample data

2. **Verify database setup**:
   - You should see success messages
   - If there are errors, check your PostgreSQL password in `.env`

### Step 4: Start the Backend Server

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify backend is running**:
   - Open browser to: http://localhost:5000/api/health
   - You should see: `{"status":"OK","message":"SmartLearn Backend is running!"}`

### Step 5: Start the Frontend

1. **Open a new terminal** (keep backend running):
   ```bash
   # In the root directory
   npm run dev
   ```

2. **Verify frontend is running**:
   - Open browser to: http://localhost:5173
   - You should see the SmartLearn homepage

## 🧪 Testing Your Setup

### Test Backend API

1. **Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Get Lessons**:
   ```bash
   curl http://localhost:5000/api/lessons
   ```

### Test Frontend

1. **Visit the homepage**: http://localhost:5173
2. **Try the translation tool**
3. **Check if lessons load**

## 🔧 Common Issues and Solutions

### Issue 1: PostgreSQL Connection Error
**Error**: `ECONNREFUSED` or `28P01`
**Solution**:
- Check if PostgreSQL is running
- Verify password in `.env` file
- Try: `pg_ctl start` in PostgreSQL bin directory

### Issue 2: Port Already in Use
**Error**: `EADDRINUSE`
**Solution**:
- Change PORT in `.env` file
- Or kill the process: `netstat -ano | findstr :5000`

### Issue 3: Frontend Can't Connect to Backend
**Error**: CORS errors or connection refused
**Solution**:
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in backend

## 🎉 Congratulations!

You now have a fully functional educational platform with:
- ✅ User authentication
- ✅ Lesson management
- ✅ Progress tracking
- ✅ Translation tools
- ✅ Modern UI/UX

Start building amazing educational content and helping students learn! 