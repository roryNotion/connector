# No-Code Connector Platform MVP

A modern, intuitive no-code platform for building automated workflows with a beautiful, Apple-inspired design.

## Features

### 🔄 Workflow Builder
- ✅ Drag-and-drop interface with React Flow
- ✅ Three node types: Triggers, Actions, and Conditions
- ✅ Visual node connections with validation
- ✅ Node configuration panel
- ✅ Workflow export/import
- 🔸 Node validation (dummy implementation)
- 🔸 Error handling (basic implementation)

### ⚡ Flow Execution
- ✅ Visual execution simulation
- ✅ Real-time execution logs
- ✅ Success/failure states
- 🔸 Actual node execution (simulated with delays)
- 🔸 Data passing between nodes (dummy implementation)
- 🔸 Execution history (in-memory only)

### 📚 Templates
- ✅ Pre-built workflow templates
- ✅ Template categorization
- ✅ Template preview
- ✅ Import template to workflow
- 🔸 Template storage (currently hardcoded)
- 🔸 Template creation (not implemented)

### 🔐 Authentication
- ✅ Basic auth context setup
- ✅ Protected routes
- 🔸 Actual authentication (dummy implementation)
- 🔸 User management (not implemented)

### 🛠 Settings
- ✅ Profile settings UI
- ✅ Security settings UI
- ✅ Notification preferences UI
- ✅ API key management UI
- 🔸 All settings functionality (dummy implementation)

### 🏪 Marketplace
- ✅ Basic marketplace UI
- 🔸 All functionality (placeholder only)

## Node Types

### Triggers
- Webhook
- Schedule
- Event

### Actions
- HTTP Request
- Send Email
- Database Operation

### Conditions
- Data comparison
- Boolean logic
- Value checking

## Technical Implementation

### Current Storage
- All data is stored in-memory using Zustand
- No persistence between page refreshes
- Workflows and templates are reset on page reload

### Simulated Features
- Node execution uses random delays (500-1000ms)
- Success/failure is randomly determined
- Authentication uses a mock user
- All form submissions are non-functional
- API keys are placeholder values

## Planned Features
- Backend API integration
- Persistent data storage
- Real node execution
- User authentication
- Template management
- Marketplace functionality
- Workflow versioning
- Collaboration features

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
This is an MVP version. Please report any bugs or feature requests through the issue tracker.

## License
MIT