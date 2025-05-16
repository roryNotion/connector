import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import Auth from '../pages/Auth';
import Workflows from '../pages/Workflows';
import WorkflowBuilder from '../pages/WorkflowBuilder';
import Templates from '../pages/Templates';
import Marketplace from '../pages/Marketplace';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Navigate to="/workflows" replace />} />
      
      <Route element={<AuthGuard />}>
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/workflows/new" element={<WorkflowBuilder />} />
        <Route path="/workflows/:id" element={<WorkflowBuilder />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
