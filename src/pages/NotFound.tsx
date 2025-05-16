import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-6 flex items-center justify-center rounded-full bg-amber-100 p-6">
        <AlertTriangle size={48} className="text-amber-600" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-gray-800">Page Not Found</h1>
      <p className="mb-6 text-center text-gray-600">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">Go Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;