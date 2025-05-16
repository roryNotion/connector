import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

interface TutorialStep {
  title: string;
  content: string;
  image?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Connector!',
    content: 'Build powerful automated workflows with our intuitive no-code platform. Let\'s get you started with the basics.',
    image: 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'Dashboard Overview',
    content: 'Your dashboard shows all your workflows at a glance. Create new workflows, manage existing ones, and monitor their performance.',
    image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'Creating Your First Workflow',
    content: 'Click "New Workflow" to start building. Drag and drop nodes, connect them together, and configure their settings.',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'Best Practices',
    content: 'Start with a trigger, add actions, and use conditions for branching logic. Test your workflow before activating it.',
    image: 'https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    title: 'Ready to Build!',
    content: 'You\'re all set! Check out our templates for inspiration or start building your own workflow.',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { addToast } = useToast();
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      saveTutorialProgress(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      saveTutorialProgress(currentStep - 1);
    }
  };
  
  const handleComplete = async () => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ 
          has_completed_tutorial: true,
          tutorial_progress: tutorialSteps.length 
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      
      addToast('Tutorial completed! You can always revisit it from the settings page.', 'success');
      onClose();
    } catch (error) {
      console.error('Failed to save tutorial progress:', error);
      addToast('Failed to save tutorial progress', 'error');
    }
  };
  
  const saveTutorialProgress = async (progress: number) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ tutorial_progress: progress })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to save tutorial progress:', error);
    }
  };
  
  if (!isOpen) return null;
  
  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {currentTutorialStep.image && (
          <div className="mb-4 h-48 w-full overflow-hidden rounded-lg">
            <img
              src={currentTutorialStep.image}
              alt={currentTutorialStep.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          {currentTutorialStep.title}
        </h2>
        
        <p className="mb-6 text-gray-600">
          {currentTutorialStep.content}
        </p>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            leftIcon={<ChevronLeft size={16} />}
          >
            Previous
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Skip for now
            </Button>
            
            {currentStep === tutorialSteps.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleComplete}
              >
                Complete
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                rightIcon={<ChevronRight size={16} />}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;