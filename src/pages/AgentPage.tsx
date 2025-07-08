import React, { useState } from 'react';
import { Search, Upload, Star, User, Code, Palette, BarChart3, Calculator, TrendingUp, Settings } from 'lucide-react';

const AgentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');

  const categories = [
    'All Categories',
    'Personal Assistant',
    'Visual Designer',
    'Marketing Expert',
    'Biotech Analyst',
    'Financial Analyst',
    'Mathematician',
    'Prediction Market Analyst',
    'Software'
  ];

  const featuredCollections = [
    {
      title: 'Productivity Tools',
      description: 'Agent collection to help you boost work efficiency, from automation to intelligent analytics.',
      icon: Settings,
      color: 'bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Creative Assistants',
      description: 'Spark your creative inspiration, from content creation to design concepts, all in one place.',
      icon: Palette,
      color: 'bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Developer Tools',
      description: 'Assistant collection for developers, including code optimization, API integration, and debugging tools.',
      icon: Code,
      color: 'bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    }
  ];

  const agents = [
    {
      id: 1,
      name: '智能助手',
      category: 'Marketing Expert',
      rating: 0.0,
      reviews: 0,
      description: '可以帮助您介绍产品可以帮助您介绍产品',
      tags: ['营销', '助手'],
      features: ['基于理解的技术'],
      avatar: '🤖',
      isFree: true
    },
    {
      id: 2,
      name: '测试云原',
      category: 'Marketing Expert',
      rating: 0.0,
      reviews: 0,
      description: '这是一个获得没有更多介绍的Agent',
      tags: ['测试', '云原'],
      features: ['基于理解的技术'],
      avatar: '🤖',
      isFree: true
    }
  ];

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search agents by name, description, tags..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload Agent</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Collections */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCollections.map((collection, index) => (
              <div key={index} className={`${collection.color} rounded-xl p-6 border-2 hover:shadow-lg transition-shadow cursor-pointer`}>
                <div className="flex items-center mb-4">
                  <collection.icon className={`w-8 h-8 ${collection.iconColor} mr-3`} />
                  <h3 className="text-xl font-semibold text-gray-900">{collection.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{collection.description}</p>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                  Explore Collection
                  <span className="ml-1">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Agents */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Agents</h2>
            <span className="ml-3 text-sm text-gray-500">(0 agents)</span>
          </div>
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No popular agents yet</h3>
            <p className="text-gray-500">Popular agents will appear here based on user engagement and ratings.</p>
          </div>
        </div>

        {/* All Agents */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Agents</h2>
            <span className="text-sm text-gray-500">2 Results</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAgents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{agent.avatar}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {agent.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{agent.rating} ({agent.reviews})</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{agent.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">免费</span>
                    <span className="text-sm text-blue-600">查看详情</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {agent.features.map((feature, index) => (
                      <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;