const WalletPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Wallet Page</h1>
        <p className="text-gray-600">这是 Wallet 页面的内容</p>
        
        {/* Wallet页面的具体内容 */}
        <div className="mt-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold">我的钱包</h3>
            <p className="text-blue-100 text-sm mt-1">0x3301...1e53</p>
            <div className="mt-4">
              <span className="text-2xl font-bold">1,234.56 ETH</span>
              <p className="text-blue-100 text-sm">≈ $2,469,120 USD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WalletPage;