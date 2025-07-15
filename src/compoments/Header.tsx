import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SimpleMetaMaskAuth from '@/utils/metaMask';

const Header: React.FC = () => {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const auth = SimpleMetaMaskAuth.getInstance();

  // 检查连接状态
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(auth.getIsConnected());
      setWalletAddress(auth.getWalletAddress());
    };

    checkConnection();

    // 监听账户变化
    const handleAccountsChanged = () => {
      checkConnection();
    };

    if (auth.isMetaMaskInstalled()) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (auth.isMetaMaskInstalled()) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  // 连接钱包
  const handleConnect = async () => {
    if (!auth.isMetaMaskInstalled()) {
      alert('请先安装 MetaMask 钱包');
      return;
    }

    setIsConnecting(true);
    try {
      const address = await auth.connectWallet();
      setIsConnected(true);
      setWalletAddress(address);
      alert('钱包连接成功！');
    } catch (error: any) {
      alert(`连接失败: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  // 断开连接
  const handleDisconnect = () => {
    auth.disconnectWallet();
    setIsConnected(false);
    setWalletAddress(null);
    setShowDropdown(false);
  };

  // 复制地址
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      alert('地址已复制');
    }
  };

  // 判断当前路由是否活跃
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // 导航项配置
  const navItems = [
    { path: '/agent', label: 'Agent' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/wallet', label: 'Wallet' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/bills', label: 'Bills' },
    { path: '/dao', label: 'DAO' },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* 左侧 Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">🧞</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Aladdin</span>
            </Link>
          </div>

          {/* 中间导航 */}
          <nav className="hidden md:flex items-center">
            <div className="flex bg-gray-100 rounded-xl p-1 space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActiveRoute(item.path)
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* 右侧钱包区域 */}
          <div className="flex items-center space-x-4">
            {/* 连接状态指示器 */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              isConnected ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span className={`text-xs ${
                isConnected ? 'text-green-600' : 'text-gray-500'
              }`}>
                {isConnected ? '已连接' : '未连接'}
              </span>
            </div>

            {/* 钱包按钮 */}
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🦊</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {auth.formatAddress(walletAddress)}
                  </span>
                </button>

                {/* 下拉菜单 */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-2">
                      <button
                        onClick={copyAddress}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        复制地址
                      </button>
                      <button
                        onClick={handleDisconnect}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        断开连接
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isConnecting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <span>连接中...</span>
                  </>
                ) : (
                  <>
                    <span>🦊</span>
                    <span>连接钱包</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 点击外部关闭下拉菜单 */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;