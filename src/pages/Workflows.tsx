import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Play, CalendarClock, MoreHorizontal } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import TutorialModal from '../components/tutorial/TutorialModal';

const Workflows: React.FC = () => {
  const navigate = useNavigate();
  const { workflows, fetchWorkflows, deleteWorkflow, isLoading } = useWorkflowStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  
  useEffect(() => {
    fetchWorkflows().catch(console.error);
    checkTutorialStatus();
  }, [fetchWorkflows]);
  
  const checkTutorialStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('has_completed_tutorial')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!preferences) {
        // Create preferences if they don't exist
        await supabase
          .from('user_preferences')
          .insert([{
            user_id: user.id,
            has_completed_tutorial: false,
            tutorial_progress: 0
          }]);
        setShowTutorial(true);
      } else if (!preferences.has_completed_tutorial) {
        setShowTutorial(true);
      }
    } catch (error) {
      console.error('Failed to check tutorial status:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleEdit = (id: string) => {
    navigate(`/workflows/${id}`);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteWorkflow(id);
      } catch (error) {
        console.error('Failed to delete workflow:', error);
      }
    }
  };
  
  const toggleMenu = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto">
        {workflows.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <h3 className="mb-2 text-xl font-medium text-gray-700">No workflows yet</h3>
            <p className="mb-4 text-gray-500">Create your first workflow to automate your tasks</p>
            <Button 
              variant="primary"
              onClick={() => navigate('/workflows/new')}
            >
              Create Workflow
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => (
              <div 
                key={workflow.id}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                {/* Preview area */}
                <div 
                  className="h-40 cursor-pointer bg-gray-50 p-4"
                  onClick={() => handleEdit(workflow.id)}
                >
                  {workflow.data?.nodes?.length > 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="flex w-full items-center justify-between space-x-4">
                        <div className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                          {workflow.data.nodes.filter((n: any) => n.type === 'trigger').length} Triggers
                        </div>
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {workflow.data.nodes.filter((n: any) => n.type === 'action').length} Actions
                        </div>
                        <div className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                          {workflow.data.nodes.filter((n: any) => n.type === 'condition').length} Conditions
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <p className="text-sm text-gray-500">Empty workflow</p>
                    </div>
                  )}
                </div>
                
                {/* Info area */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 
                      className="cursor-pointer truncate text-lg font-medium text-gray-900"
                      onClick={() => handleEdit(workflow.id)}
                    >
                      {workflow.name}
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() => toggleMenu(workflow.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {selectedId === workflow.id && (
                        <div className="absolute right-0 z-10 mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                          <button
                            onClick={() => {
                              handleEdit(workflow.id);
                              setSelectedId(null);
                            }}
                            className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit size={16} className="mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(workflow.id);
                              setSelectedId(null);
                            }}
                            className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {workflow.description || 'No description'}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarClock size={14} className="mr-1" />
                      <span>Updated {formatDate(workflow.updated_at)}</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Play size={14} />}
                      onClick={() => handleEdit(workflow.id)}
                    >
                      Run
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </>
  );
};

export default Workflows;