import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import AppLayout from './components/layout/AppLayout';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <ReactFlowProvider>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </ReactFlowProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;