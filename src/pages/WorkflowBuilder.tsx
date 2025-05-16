import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Controls,
  Background,
  Panel,
  useReactFlow,
  BackgroundVariant,
  ReactFlowProvider,
  Node,
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../store/workflowStore';
import { Save, Play, Database, Clipboard, ChevronRight, AlertTriangle, Code, CheckCircle, X } from 'lucide-react';
import Button from '../components/ui/Button';
import NodePanel from '../components/workflow/NodePanel';
import NodeConfigPanel from '../components/workflow/NodeConfigPanel';
import TriggerNode from '../components/workflow/nodes/TriggerNode';
import ActionNode from '../components/workflow/nodes/ActionNode';
import ConditionNode from '../components/workflow/nodes/ConditionNode';
import { NodeType } from '../types/workflow';
import { useToast } from '../context/ToastContext';
import { Integration, IntegrationAction } from '../types/integrations';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

const WorkflowBuilderContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { 
    currentWorkflow,
    createWorkflow,
    loadWorkflow,
    updateWorkflow,
    onNodesChange,
    onEdgesChange,
    connectNodes,
    addNode,
    isLoading
  } = useWorkflowStore();
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodePanelOpen, setNodePanelOpen] = useState(false);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  
  const reactFlowInstance = useReactFlow();
  
  useEffect(() => {
    const initializeWorkflow = async () => {
      try {
        if (id === 'new') {
          const newId = await createWorkflow('New Workflow');
          navigate(`/workflows/${newId}`, { replace: true });
        } else if (id) {
          await loadWorkflow(id);
        }
      } catch (error) {
        console.error('Failed to initialize workflow:', error);
        addToast('Failed to load workflow', 'error');
        navigate('/workflows');
      }
    };
    
    initializeWorkflow();
  }, [id, createWorkflow, loadWorkflow, navigate, addToast]);
  
  useEffect(() => {
    if (currentWorkflow) {
      setWorkflowName(currentWorkflow.name);
      setWorkflowDescription(currentWorkflow.description || '');
    }
  }, [currentWorkflow]);
  
  const handleSave = async () => {
    if (!currentWorkflow) return;
    
    try {
      await updateWorkflow(currentWorkflow.id, {
        name: workflowName,
        description: workflowDescription
      });
      
      addToast('Workflow saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      addToast('Failed to save workflow', 'error');
    }
  };
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setSelectedNode(node.id);
    setConfigPanelOpen(true);
  }, []);
  
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setConfigPanelOpen(false);
  }, []);
  
  const handleAddNode = useCallback((type: NodeType, integration?: Integration, action?: IntegrationAction) => {
    if (!reactFlowInstance) return;
    
    const position = reactFlowInstance.project({
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 40,
    });
    
    addNode(type, position);
    setNodePanelOpen(false);
  }, [reactFlowInstance, addNode]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-1 flex-col md:flex-row md:items-center">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Workflow Name"
            className="text-md w-full border-none px-2 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 md:w-64"
          />
          <input
            type="text"
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full border-none px-2 py-1 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Save size={14} />}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
      
      <div className="relative flex-1 rounded-lg border border-gray-200 bg-white shadow-sm">
        <ReactFlow
          nodes={currentWorkflow?.nodes || []}
          edges={currentWorkflow?.edges || []}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={connectNodes}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls />
          
          <Panel position="top-right" className="m-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setNodePanelOpen(true)}
            >
              Add Node
            </Button>
          </Panel>
        </ReactFlow>
        
        <NodePanel 
          isOpen={nodePanelOpen} 
          onClose={() => setNodePanelOpen(false)}
          onAddNode={handleAddNode}
        />
        
        <NodeConfigPanel
          isOpen={configPanelOpen && !!selectedNode}
          onClose={() => {
            setConfigPanelOpen(false);
            setSelectedNode(null);
          }}
          nodeId={selectedNode}
        />
      </div>
    </div>
  );
};

const WorkflowBuilder: React.FC = () => {
  return (
    <ReactFlowProvider>
      <div className="h-full w-full">
        <WorkflowBuilderContent />
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;