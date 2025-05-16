import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflowStore } from '../store/workflowStore';
import { BookOpen, Download, Search, Tag } from 'lucide-react';
import Button from '../components/ui/Button';
import { Template } from '../types/workflow';

// Sample templates
const sampleTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'API to Database',
    description: 'Fetch data from an API and store it in a database',
    category: 'Data Integration',
    createdAt: new Date().toISOString(),
    thumbnail: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=300',
    workflow: {
      id: 'template-1-workflow',
      name: 'API to Database',
      description: 'Fetch data from an API and store it in a database',
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: { name: 'Schedule Trigger', triggerType: 'schedule', config: { cron: '0 * * * *' } }
        },
        {
          id: 'action-1',
          type: 'action',
          position: { x: 400, y: 100 },
          data: { name: 'Fetch API Data', actionType: 'http', config: { url: 'https://api.example.com/data', method: 'GET' } }
        },
        {
          id: 'action-2',
          type: 'action',
          position: { x: 700, y: 100 },
          data: { name: 'Store in Database', actionType: 'database', config: { operation: 'insert', table: 'api_data' } }
        }
      ],
      edges: [
        { id: 'edge-1', source: 'trigger-1', target: 'action-1', type: 'default' },
        { id: 'edge-2', source: 'action-1', target: 'action-2', type: 'default' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'template-2',
    name: 'Form Submission Handler',
    description: 'Handle form submissions and send email notifications',
    category: 'Web',
    createdAt: new Date().toISOString(),
    thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300',
    workflow: {
      id: 'template-2-workflow',
      name: 'Form Submission Handler',
      description: 'Handle form submissions and send email notifications',
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: { name: 'Webhook Trigger', triggerType: 'webhook', config: { path: '/form-submit' } }
        },
        {
          id: 'condition-1',
          type: 'condition',
          position: { x: 400, y: 100 },
          data: { 
            name: 'Validate Form', 
            condition: { 
              left: 'data.email', 
              operator: 'contains', 
              right: '@' 
            } 
          }
        },
        {
          id: 'action-1',
          type: 'action',
          position: { x: 700, y: 0 },
          data: { name: 'Send Confirmation', actionType: 'email', config: { to: '{{data.email}}', subject: 'Form Received' } }
        },
        {
          id: 'action-2',
          type: 'action',
          position: { x: 700, y: 200 },
          data: { name: 'Log Error', actionType: 'database', config: { operation: 'insert', table: 'form_errors' } }
        }
      ],
      edges: [
        { id: 'edge-1', source: 'trigger-1', target: 'condition-1', type: 'default' },
        { id: 'edge-2', source: 'condition-1', target: 'action-1', type: 'default' },
        { id: 'edge-3', source: 'condition-1', target: 'action-2', type: 'default' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'template-3',
    name: 'Notification System',
    description: 'Send notifications through multiple channels',
    category: 'Communication',
    createdAt: new Date().toISOString(),
    thumbnail: 'https://images.pexels.com/photos/9622206/pexels-photo-9622206.jpeg?auto=compress&cs=tinysrgb&w=300',
    workflow: {
      id: 'template-3-workflow',
      name: 'Notification System',
      description: 'Send notifications through multiple channels',
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: { name: 'Event Trigger', triggerType: 'event', config: { eventName: 'notification.send' } }
        },
        {
          id: 'action-1',
          type: 'action',
          position: { x: 400, y: 0 },
          data: { name: 'Send Email', actionType: 'email', config: { to: '{{data.email}}', subject: '{{data.subject}}' } }
        },
        {
          id: 'action-2',
          type: 'action',
          position: { x: 400, y: 100 },
          data: { name: 'Send SMS', actionType: 'http', config: { url: 'https://api.twilio.com/sms', method: 'POST' } }
        }
      ],
      edges: [
        { id: 'edge-1', source: 'trigger-1', target: 'action-1', type: 'default' },
        { id: 'edge-2', source: 'trigger-1', target: 'action-2', type: 'default' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
];

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const { importWorkflow } = useWorkflowStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get unique categories
  const categories = Array.from(new Set(sampleTemplates.map(template => template.category)));
  
  // Filter templates by search term and category
  const filteredTemplates = sampleTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleUseTemplate = (template: Template) => {
    // Import the workflow from the template
    try {
      const workflowJson = JSON.stringify(template.workflow);
      importWorkflow(workflowJson);
      
      // Navigate to the workflow builder
      navigate(`/workflows/${template.workflow.id}`);
    } catch (error) {
      console.error('Failed to use template:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        {/* Search and Filter */}
        <div className="flex flex-1 flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Tag size={16} className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-700">Filter:</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-md px-3 py-1 text-sm ${
                  selectedCategory === null
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-md px-3 py-1 text-sm ${
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Template thumbnail */}
            {template.thumbnail && (
              <div className="h-40 w-full overflow-hidden bg-gray-100">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            
            {/* Template info */}
            <div className="p-4">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  {template.category}
                </span>
              </div>
              
              <p className="mb-4 text-sm text-gray-500">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <BookOpen size={14} className="mr-1" />
                  <span>{template.workflow.nodes.length} nodes</span>
                </div>
                
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={() => handleUseTemplate(template)}
                >
                  Use Template
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className="col-span-full mt-8 flex flex-col items-center justify-center">
            <p className="text-center text-gray-500">No templates found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;