const DashboardPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600">这是 Dashboard 页面的内容</p>
        
        {/* Dashboard页面的具体内容 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">总代理数</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">127</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">活跃任务</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">23</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">总收入</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">$12,456</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">用户评分</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">4.8</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;