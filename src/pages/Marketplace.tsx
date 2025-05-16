import React from 'react';
import { Construction } from 'lucide-react';

const Marketplace: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <div className="mb-4 rounded-full bg-blue-100 p-4">
          <Construction size={32} className="text-blue-600" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">Marketplace Coming Soon</h2>
        <p className="mb-6 max-w-md text-gray-500">
          Our marketplace will feature connectors, templates, and integrations to help you automate your workflows faster.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-medium text-gray-800">Connectors</h3>
            <p className="text-sm text-gray-500">Pre-built integrations for popular services and APIs.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-medium text-gray-800">Templates</h3>
            <p className="text-sm text-gray-500">Ready-to-use workflow templates for common scenarios.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-medium text-gray-800">Custom Actions</h3>
            <p className="text-sm text-gray-500">Specialized actions for specific business needs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;