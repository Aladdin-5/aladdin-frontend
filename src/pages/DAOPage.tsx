const DAOPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">DAO Page</h1>
        <p className="text-gray-600">这是 DAO 页面的内容</p>
        
        {/* DAO页面的具体内容 */}
        <div className="mt-6 space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">提案 #001: 增加新的AI模型</h3>
            <p className="text-gray-600 mb-4">提议增加GPT-4模型到我们的代理平台</p>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">赞成</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">反对</button>
              <span className="text-sm text-gray-500">截止时间: 2024-02-01</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">提案 #002: 治理代币分发</h3>
            <p className="text-gray-600 mb-4">关于治理代币分发机制的改进建议</p>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">赞成</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">反对</button>
              <span className="text-sm text-gray-500">截止时间: 2024-01-28</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DAOPage;