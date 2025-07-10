import React from 'react';
import { X, Star } from 'lucide-react';
import { Agent,AgentDetailModalProps } from '@/types/agents/index';



const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          {/* Agent Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-3xl">{agent.avatar}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{agent.name}</h2>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{agent.rating}</span>
                <span className="text-sm text-gray-400">({agent.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button className="py-2 px-1 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
                Use
              </button>
              <button className="py-2 px-1 text-gray-500 font-medium text-sm">
                API
              </button>
              <button className="py-2 px-1 text-gray-500 font-medium text-sm">
                流程
              </button>
            </nav>
          </div>

          {/* Pricing Model */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Pricing Model</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Free to Use</span>
                <span className="text-sm text-green-600 font-medium">Free</span>
              </div>
              <p className="text-xs text-gray-500">
                This agent is free to use with no usage limits
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Use for Free
            </button>
            <div className="flex space-x-3">
              <button 
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Use Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailModal;