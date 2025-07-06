const AgentPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Agent Page</h1>
        <p className="text-gray-600">这是 Agent 页面的内容</p>
        
        {/* Agent页面的具体内容 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">AI Assistant</h3>
            <p className="text-blue-600 text-sm mt-2">智能助手代理</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Data Analyst</h3>
            <p className="text-green-600 text-sm mt-2">数据分析代理</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Content Creator</h3>
            <p className="text-purple-600 text-sm mt-2">内容创作代理</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AgentPage;