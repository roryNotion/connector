import { create } from 'zustand';
import { Integration } from '../types/integrations';

interface IntegrationStore {
  integrations: Integration[];
  connectIntegration: (id: string, credentials: any) => void;
  disconnectIntegration: (id: string) => void;
  getIntegration: (id: string) => Integration | undefined;
}

const defaultIntegrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send and receive messages from Slack',
    icon: 'https://cdn.iconscout.com/icon/free/png-256/slack-2752072-2284889.png',
    authType: 'oauth',
    connected: false,
    category: 'Communication',
    actions: [
      {
        id: 'send_message',
        label: 'Send Message',
        type: 'action',
        description: 'Send a message to a Slack channel',
        fields: [
          {
            name: 'channel',
            label: 'Channel',
            type: 'text',
            required: true,
            placeholder: '#general'
          },
          {
            name: 'message',
            label: 'Message',
            type: 'text',
            required: true,
            placeholder: 'Enter your message'
          }
        ]
      }
    ],
    triggers: [
      {
        id: 'new_message',
        label: 'New Message in Channel',
        type: 'trigger',
        description: 'Triggers when a new message is posted to a channel',
        fields: [
          {
            name: 'channel',
            label: 'Channel',
            type: 'text',
            required: true,
            placeholder: '#general'
          }
        ]
      }
    ]
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Manage your Airtable bases',
    icon: 'https://cdn.iconscout.com/icon/free/png-256/airtable-1482122-1254387.png',
    authType: 'api_key',
    connected: false,
    category: 'Database',
    actions: [
      {
        id: 'create_record',
        label: 'Create Record',
        type: 'action',
        description: 'Create a new record in an Airtable base',
        fields: [
          {
            name: 'base',
            label: 'Base ID',
            type: 'text',
            required: true,
            placeholder: 'Enter base ID'
          },
          {
            name: 'table',
            label: 'Table Name',
            type: 'text',
            required: true,
            placeholder: 'Enter table name'
          }
        ]
      },
      {
        id: 'update_record',
        label: 'Update Record',
        type: 'action',
        description: 'Update an existing record',
        fields: [
          {
            name: 'base',
            label: 'Base ID',
            type: 'text',
            required: true,
            placeholder: 'Enter base ID'
          },
          {
            name: 'table',
            label: 'Table Name',
            type: 'text',
            required: true,
            placeholder: 'Enter table name'
          },
          {
            name: 'record',
            label: 'Record ID',
            type: 'text',
            required: true,
            placeholder: 'Enter record ID'
          }
        ]
      }
    ],
    triggers: []
  },
  {
    id: 'http',
    name: 'HTTP',
    description: 'Make HTTP requests and handle webhooks',
    icon: 'https://cdn.iconscout.com/icon/free/png-256/api-134-1146082.png',
    authType: 'none',
    connected: true,
    category: 'Development',
    actions: [
      {
        id: 'make_request',
        label: 'Make Request',
        type: 'action',
        description: 'Make an HTTP request to any URL',
        fields: [
          {
            name: 'url',
            label: 'URL',
            type: 'text',
            required: true,
            placeholder: 'https://api.example.com'
          },
          {
            name: 'method',
            label: 'Method',
            type: 'select',
            required: true,
            options: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
              { label: 'PUT', value: 'PUT' },
              { label: 'DELETE', value: 'DELETE' }
            ]
          }
        ]
      }
    ],
    triggers: [
      {
        id: 'webhook',
        label: 'Webhook',
        type: 'trigger',
        description: 'Listen for incoming webhook requests',
        fields: [
          {
            name: 'path',
            label: 'Path',
            type: 'text',
            required: true,
            placeholder: '/webhook'
          }
        ]
      }
    ]
  }
];

export const useIntegrationStore = create<IntegrationStore>((set, get) => ({
  integrations: defaultIntegrations,
  
  connectIntegration: (id, credentials) => {
    set((state) => ({
      integrations: state.integrations.map((integration) =>
        integration.id === id ? { ...integration, connected: true } : integration
      )
    }));
  },
  
  disconnectIntegration: (id) => {
    set((state) => ({
      integrations: state.integrations.map((integration) =>
        integration.id === id ? { ...integration, connected: false } : integration
      )
    }));
  },
  
  getIntegration: (id) => {
    return get().integrations.find((integration) => integration.id === id);
  }
}));