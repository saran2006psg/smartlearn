import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useAuthStore } from '../stores/authStore';
import { ISLAvatar3D } from '../components/avatar/ISLAvatar3D';
import { Button } from '../components/ui/Button';

const clientId = "26523042977-lnjg7thulco3lhjiqmb1r9g6cvr9p9u1.apps.googleusercontent.com";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (options: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

interface GoogleCredentialResponse {
  credential: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = (response: GoogleCredentialResponse) => {
    if (response.credential) {
      const decoded = jwtDecode<{ email: string } & JwtPayload>(response.credential);
      if (decoded && decoded.email) {
        login(decoded.email).then(() => {
          navigate('/dashboard');
        });
      }
    }
  };

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 300,
        });
      }
    }
  }, []);

  // Fallback login for demo/testing
  const handleDemoLogin = () => {
    login('demo@smartlearn.com').then(() => {
      navigate('/dashboard');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <ISLAvatar3D className="mb-6 w-full h-64" isAnimating={true} text="Welcome!" />
        <h2 className="text-3xl font-extrabold text-center text-primary-700 dark:text-primary-200 mb-2">Sign in to <span className="text-indigo-600 dark:text-indigo-400">SmartLearn</span></h2>
        <p className="text-gray-500 dark:text-gray-300 text-center mb-6">Empowering learning with Indian Sign Language</p>
        <div ref={googleButtonRef} id="google-signin" className="flex justify-center mb-4" />
        <div className="w-full flex items-center my-4">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
          <span className="mx-2 text-gray-400 dark:text-gray-500 text-xs">or</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
        </div>
        <Button variant="outline" size="md" className="w-full" onClick={handleDemoLogin}>
          Continue as Demo User
        </Button>
      </div>
      <p className="mt-8 text-gray-400 text-xs text-center">&copy; {new Date().getFullYear()} SmartLearn. All rights reserved.</p>
    </div>
  );
};

export default Login; 