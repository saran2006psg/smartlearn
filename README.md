# VaaniPlus - Inclusive Educational Platform

VaaniPlus is a comprehensive educational platform designed to provide inclusive learning experiences for students of all abilities, with support for multiple languages and accessibility features.

## Features

- 🌐 **Multi-language Support**: Hindi, English, Gujarati, Tamil, Kannada, Bengali, and Urdu
- 🎨 **Accessibility**: High-contrast themes and customizable font sizes
- 📚 **Interactive Lessons**: Engaging educational content across various subjects
- 📊 **Progress Tracking**: Real-time monitoring of learning progress
- ✍️ **Writing Tools**: Digital writing pad with signature capabilities
- 🔄 **Translation Tools**: Multi-language translation with ISL video support
- 🔐 **Google Authentication**: Secure login with Google OAuth

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sb1-qxapdo6s
```

2. Install dependencies:
```bash
npm install
```

3. Set up Google OAuth (see [Google OAuth Setup Guide](./GOOGLE_OAUTH_SETUP.md))

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Google Authentication Setup

This application uses Google OAuth for secure authentication. Follow the detailed setup guide in [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) to configure Google authentication.

### Quick Setup Steps:

1. Create a Google Cloud Project
2. Enable Google+ API
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials
5. Update the Client ID in `src/App.tsx`

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout and navigation
│   ├── lessons/        # Lesson-related components
│   ├── translation/    # Translation tools
│   ├── ui/            # Reusable UI components
│   └── writing/       # Writing tools
├── pages/             # Page components
├── stores/            # State management (Zustand)
├── types/             # TypeScript type definitions
└── i18n/              # Internationalization
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Navigation
- **React i18next** - Internationalization
- **@react-oauth/google** - Google authentication

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the [Google OAuth Setup Guide](./GOOGLE_OAUTH_SETUP.md) for authentication issues
- Review the troubleshooting section in the setup guide
- Open an issue on GitHub for bugs or feature requests
