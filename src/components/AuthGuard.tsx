import React, { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle } from 'lucide-react';
import Button from './ui/Button';

const AuthGuard: React.FC = () => {
  const { isAuthenticated, isLoading, error, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/auth', { 
        state: { from: location.pathname },
        replace: true
      });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-2 text-lg font-semibold">Authentication Error</h2>
          <p className="mt-1 text-gray-500">{error}</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => {
              checkAuth();
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default AuthGuard;