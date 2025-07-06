const JobsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Jobs Page</h1>
        <p className="text-gray-600">这是 Jobs 页面的内容</p>
        
        {/* Jobs页面的具体内容 */}
        <div className="mt-6 space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-semibold text-gray-900">Frontend Developer</h3>
            <p className="text-gray-600 text-sm">React + TypeScript 开发</p>
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Remote</span>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-semibold text-gray-900">Backend Engineer</h3>
            <p className="text-gray-600 text-sm">Node.js + MongoDB 开发</p>
            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Full-time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default JobsPage;