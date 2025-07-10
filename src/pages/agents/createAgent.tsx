import React, { useState } from 'react';
import { ArrowLeft, Upload, Eye, EyeOff } from 'lucide-react';

const AgentCreatePage = () => {
  const [formData, setFormData] = useState({
    agentName: '',
    tags: '',
    autoSourceData: false,
    agentClassification: '',
    agentAddress: '',
    baseInstructionSet: '',
    eventFile: '',
    isPrivate: false,
    repo: ''
  });

  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Here you would handle the form submission
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deploy Agent Based on Aladdin Protocol</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Deploy agents to multi-network operating services in one click! Select a network endpoint, name the key concepts, and
            set up basic AI parameters to let your agent interact with the network. Our Aladdin AI model
            will help you prepare automatic guidance and fine-tuning suggestions.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="space-y-6">
            {/* Agent Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                value={formData.agentName}
                onChange={(e) => handleInputChange('agentName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter agent name"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tags separated by commas"
              />
            </div>

            {/* Auto Source Data */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto Source Data
                </label>
                <p className="text-sm text-gray-500">
                  Automatically source data for your agent
                </p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleInputChange('autoSourceData', !formData.autoSourceData)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.autoSourceData ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.autoSourceData ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Agent Classification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Classification
              </label>
              <select
                value={formData.agentClassification}
                onChange={(e) => handleInputChange('agentClassification', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select agent classification</option>
                <option value="personal-assistant">Personal Assistant</option>
                <option value="visual-designer">Visual Designer</option>
                <option value="marketing-expert">Marketing Expert</option>
                <option value="biotech-analyst">Biotech Analyst</option>
                <option value="financial-analyst">Financial Analyst</option>
                <option value="mathematician">Mathematician</option>
                <option value="prediction-market-analyst">Prediction Market Analyst</option>
                <option value="software">Software</option>
              </select>
            </div>

            {/* Agent Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Address
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={formData.agentAddress}
                  onChange={(e) => handleInputChange('agentAddress', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter agent address"
                />
                <span className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                  View with GUI Console
                </span>
              </div>
            </div>

            {/* Base Instruction Set */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Instruction Set
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-red-50">
                <p className="text-sm text-red-700 mb-2">
                  Warning: This instruction set contains sensitive information that could be exploited if not properly secured.
                </p>
                <textarea
                  value={formData.baseInstructionSet}
                  onChange={(e) => handleInputChange('baseInstructionSet', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter base instruction set"
                />
              </div>
            </div>

            {/* Event File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop your event file here, or{' '}
                  <span className="text-blue-600 cursor-pointer hover:text-blue-800">click to browse</span>
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: .json, .csv, .txt (Max 10MB)
                </p>
              </div>
            </div>

            {/* Private */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Private
                </label>
                <p className="text-sm text-gray-500">
                  Make this agent private and only accessible to you
                </p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleInputChange('isPrivate', !formData.isPrivate)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.isPrivate ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.isPrivate ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Repo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repo
              </label>
              <div className="relative">
                <input
                  type={showPrivateKey ? 'text' : 'password'}
                  value={formData.repo}
                  onChange={(e) => handleInputChange('repo', e.target.value)}
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter repository URL or private key"
                />
                <button
                  type="button"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPrivateKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Deploy Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCreatePage;