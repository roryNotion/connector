import { create } from 'zustand';
import { Edge, Node, addEdge, Connection, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { NodeType, WorkflowStatus, ExecutionLog, Workflow } from '../types/workflow';
import { supabase } from '../lib/supabase';

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  executions: Record<string, ExecutionLog[]>;
  status: WorkflowStatus;
  isLoading: boolean;
  error: string | null;
  
  fetchWorkflows: () => Promise<void>;
  createWorkflow: (name: string) => Promise<string>;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  loadWorkflow: (id: string) => Promise<void>;
  
  addNode: (type: NodeType, position: { x: number, y: number }) => Promise<void>;
  updateNode: (id: string, data: any) => Promise<void>;
  onNodesChange: (changes: any) => void;
  
  connectNodes: (connection: Connection) => Promise<void>;
  onEdgesChange: (changes: any) => void;
}

const getDefaultNodeData = (type: NodeType) => {
  switch (type) {
    case 'trigger':
      return { name: 'New Trigger', triggerType: 'webhook', config: {} };
    case 'action':
      return { name: 'New Action', actionType: 'http', config: {} };
    case 'condition':
      return { name: 'New Condition', condition: { left: '', operator: 'equals', right: '' } };
    default:
      return { name: 'Unknown Node' };
  }
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  executions: {},
  status: 'idle',
  isLoading: false,
  error: null,
  
  fetchWorkflows: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: workflows, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Ensure each workflow has a valid data structure
      const validWorkflows = workflows?.map(workflow => ({
        ...workflow,
        data: workflow.data || { nodes: [], edges: [] }
      })) || [];
      
      set({ workflows: validWorkflows });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch workflows';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  createWorkflow: async (name: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const newWorkflow = {
        name,
        description: '',
        data: {
          nodes: [],
          edges: []
        }
      };
      
      const { data, error } = await supabase
        .from('workflows')
        .insert([newWorkflow])
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create workflow');
      
      set(state => ({
        workflows: [data, ...state.workflows],
        currentWorkflow: data
      }));
      
      return data.id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create workflow';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadWorkflow: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: workflow, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!workflow) throw new Error('Workflow not found');
      
      // Ensure data structure exists
      workflow.data = workflow.data || { nodes: [], edges: [] };
      
      set({ currentWorkflow: workflow });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load workflow';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateWorkflow: async (id: string, updates: Partial<Workflow>) => {
    try {
      set({ isLoading: true, error: null });
      
      const currentWorkflow = get().currentWorkflow;
      if (!currentWorkflow) throw new Error('No workflow selected');
      
      const updatedWorkflow = {
        ...updates,
        data: currentWorkflow.data
      };
      
      const { error } = await supabase
        .from('workflows')
        .update(updatedWorkflow)
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        workflows: state.workflows.map(wf => 
          wf.id === id ? { ...wf, ...updatedWorkflow } : wf
        ),
        currentWorkflow: { ...currentWorkflow, ...updatedWorkflow }
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update workflow';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteWorkflow: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        workflows: state.workflows.filter(wf => wf.id !== id),
        currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete workflow';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  addNode: async (type: NodeType, position: { x: number, y: number }) => {
    try {
      const currentWorkflow = get().currentWorkflow;
      if (!currentWorkflow) throw new Error('No workflow selected');
      
      const newNode: Node = {
        id: `${type}-${nanoid(6)}`,
        type,
        position,
        data: getDefaultNodeData(type)
      };
      
      const updatedNodes = [...(currentWorkflow.data.nodes || []), newNode];
      
      const { error } = await supabase
        .from('workflows')
        .update({
          data: {
            ...currentWorkflow.data,
            nodes: updatedNodes
          }
        })
        .eq('id', currentWorkflow.id);
      
      if (error) throw error;
      
      set({
        currentWorkflow: {
          ...currentWorkflow,
          data: {
            ...currentWorkflow.data,
            nodes: updatedNodes
          }
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add node';
      set({ error: message });
      throw error;
    }
  },
  
  updateNode: async (id: string, data: any) => {
    try {
      const currentWorkflow = get().currentWorkflow;
      if (!currentWorkflow) throw new Error('No workflow selected');
      
      const updatedNodes = currentWorkflow.data.nodes.map(node =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      );
      
      const { error } = await supabase
        .from('workflows')
        .update({
          data: {
            ...currentWorkflow.data,
            nodes: updatedNodes
          }
        })
        .eq('id', currentWorkflow.id);
      
      if (error) throw error;
      
      set({
        currentWorkflow: {
          ...currentWorkflow,
          data: {
            ...currentWorkflow.data,
            nodes: updatedNodes
          }
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update node';
      set({ error: message });
      throw error;
    }
  },
  
  onNodesChange: (changes) => {
    set(state => {
      if (!state.currentWorkflow) return state;
      
      const updatedNodes = applyNodeChanges(changes, state.currentWorkflow.data.nodes);
      
      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          data: {
            ...state.currentWorkflow.data,
            nodes: updatedNodes
          }
        }
      };
    });
  },
  
  connectNodes: async (connection) => {
    try {
      const currentWorkflow = get().currentWorkflow;
      if (!currentWorkflow) throw new Error('No workflow selected');
      
      const newEdge = {
        ...connection,
        id: `edge-${nanoid(6)}`
      };
      
      const updatedEdges = addEdge(newEdge, currentWorkflow.data.edges || []);
      
      const { error } = await supabase
        .from('workflows')
        .update({
          data: {
            ...currentWorkflow.data,
            edges: updatedEdges
          }
        })
        .eq('id', currentWorkflow.id);
      
      if (error) throw error;
      
      set({
        currentWorkflow: {
          ...currentWorkflow,
          data: {
            ...currentWorkflow.data,
            edges: updatedEdges
          }
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect nodes';
      set({ error: message });
      throw error;
    }
  },
  
  onEdgesChange: (changes) => {
    set(state => {
      if (!state.currentWorkflow) return state;
      
      const updatedEdges = applyEdgeChanges(changes, state.currentWorkflow.data.edges || []);
      
      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          data: {
            ...state.currentWorkflow.data,
            edges: updatedEdges
          }
        }
      };
    });
  }
}));