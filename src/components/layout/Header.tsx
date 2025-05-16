import React, { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  title: string;
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isWorkflowBuilder = location.pathname.includes('/workflows/');
  const isWorkflowsList = location.pathname === '/workflows';
  const isTemplatesList = location.pathname === '/templates';
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleNewWorkflow = () => {
    navigate('/workflows/new');
  };

  return (
    <header className="z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-3">
          {children}
          
          {isWorkflowBuilder && (
            <button
              onClick={handleBack}
              className="flex items-center rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Back</span>
            </button>
          )}
          
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {(isWorkflowsList || isTemplatesList) && (
            <Button
              onClick={handleNewWorkflow}
              variant="primary"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>{isWorkflowsList ? 'New Workflow' : 'Use Template'}</span>
            </Button>
          )}
          
          {isWorkflowBuilder && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Save workflow')}
              >
                Save
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => console.log('Run workflow')}
              >
                Run Flow
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;