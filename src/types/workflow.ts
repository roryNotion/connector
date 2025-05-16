import { Node, Edge } from 'reactflow';

export type NodeType = 'trigger' | 'action' | 'condition';

export type WorkflowStatus = 'idle' | 'running' | 'completed' | 'error';

export type LogLevel = 'info' | 'warning' | 'error' | 'success';

export interface ExecutionLog {
  id: string;
  nodeId: string | null;
  message: string;
  level: LogLevel;
  timestamp: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  data: {
    nodes: Node[];
    edges: Edge[];
  };
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow: Workflow;
  createdAt: string;
  thumbnail?: string;
}