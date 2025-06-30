# SmartLearn - Educational Platform

A comprehensive educational platform built with React (Frontend) and Node.js/Express (Backend) with PostgreSQL database.

## 📖 Quick Links

- **[Setup & Running Guide](./SETUP.md)** - Complete setup instructions
- **[Improvement Roadmap](./IMPROVEMENT_ROADMAP.md)** - Development roadmap
- **[Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md)** - Authentication setup
- **[API Keys Setup](./API_KEYS_SETUP.md)** - External service configuration

## 🎯 Project Overview

SmartLearn is an inclusive educational platform designed to provide learning experiences for students of all abilities, with support for multiple languages and accessibility features.

### 🌟 Key Features

- 🌐 **Multi-language Support**: Hindi, English, Gujarati, Tamil, Kannada, Bengali, and Urdu
- 🎨 **Accessibility**: High-contrast themes and customizable font sizes
- 📚 **Interactive Lessons**: Engaging educational content across various subjects
- 📊 **Progress Tracking**: Real-time monitoring of learning progress
- ✍️ **Writing Tools**: Digital writing pad with signature capabilities
- 🔄 **Translation Tools**: Multi-language translation with ISL video support
- 🔐 **Google Authentication**: Secure login with Google OAuth

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Internationalization**: React i18next
- **Animations**: Framer Motion

### Backend (Node.js + Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + Google OAuth
- **Security**: Helmet, CORS, Rate limiting

### Database (PostgreSQL)
- **Tables**: Users, Lessons, Progress, Translations, Activities
- **Features**: UUID primary keys, JSONB for flexible data, Triggers for timestamps

## 📁 Project Structure

```
smartlearn/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── layout/        # Layout and navigation
│   │   ├── lessons/       # Lesson-related components
│   │   ├── translation/   # Translation tools
│   │   ├── ui/           # Reusable UI components
│   │   └── writing/      # Writing tools
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── stores/            # State management (Zustand)
│   ├── types/             # TypeScript types
│   └── i18n/              # Internationalization
├── backend/               # Backend Node.js application
│   ├── config/            # Database configuration
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── server.js          # Main server file
├── SETUP.md               # Setup and running instructions
├── IMPROVEMENT_ROADMAP.md # Development roadmap
└── README.md              # This file
```

## 🚀 Next Steps & Improvements

### 🎯 Immediate Priorities (Next 2 Weeks)

1. **Create Sample Lesson Content**
   - Add 5-10 sample lessons across categories
   - Implement lesson viewer with video support
   - Add interactive exercises and quizzes

2. **Enhance Authentication System**
   - Add email/password authentication
   - Implement password reset functionality
   - Add user profile management

3. **Improve User Experience**
   - Add loading states and error handling
   - Enhance accessibility features
   - Optimize mobile responsiveness

### 📋 Complete Improvement Roadmap

For a detailed improvement plan with 6 phases covering:
- Core functionality enhancements
- UI/UX improvements
- Technical optimizations
- Advanced features (AI/ML)
- Platform expansion
- Production deployment

**📖 See:** [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md)

### 🔥 Critical Next Actions

| Task | Priority | Timeline |
|------|----------|----------|
| Add sample lesson content | 🔴 Critical | Week 1 |
| Implement email authentication | 🔴 Critical | Week 1 |
| Add progress tracking | 🔴 Critical | Week 2 |
| Mobile optimization | 🟡 High | Week 2 |
| Accessibility improvements | 🟡 High | Week 2 |

## 🔐 Authentication

The application supports:
- Google OAuth (optional)
- JWT-based authentication
- Session management

## 📚 API Documentation

### Main Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/google` - Google OAuth login
- `GET /api/lessons` - Get lessons
- `POST /api/translations/translate` - Translate text
- `GET /api/users/profile` - Get user profile
- `GET /api/progress/overview` - Get learning progress

## 🛠️ Development

### Adding New Features

1. **Backend API Endpoints:**
   - Add routes in `backend/routes/`
   - Update database schema if needed
   - Test with API tools (Postman, etc.)

2. **Frontend Components:**
   - Add components in `src/components/`
   - Add pages in `src/pages/`
   - Update routing as needed

### Environment Variables

Make sure to update the following in your `.env` files:
- Database password
- JWT secret
- Google OAuth credentials (if using)
- API URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the [Setup Guide](./SETUP.md) troubleshooting section
2. Verify all prerequisites are installed
3. Check the logs in both terminal windows
4. Ensure all environment variables are set correctly

---

**Happy Learning! 🎓**
