export type IntegrationType = 'trigger' | 'action';

export interface IntegrationAction {
  id: string;
  label: string;
  type: IntegrationType;
  description: string;
  icon?: string;
  fields?: IntegrationField[];
}

export interface IntegrationField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'boolean' | 'password';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  brandColor?: string;
  authType: 'api_key' | 'oauth' | 'none';
  connected: boolean;
  category: string;
  features?: string[];
  permissions?: string[];
  configFields?: IntegrationField[];
  connectedAccount?: string;
  lastSynced?: string;
  actions: IntegrationAction[];
  triggers: IntegrationAction[];
}