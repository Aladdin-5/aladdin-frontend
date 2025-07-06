import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

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
              {/* Logo图标 */}
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mr-3 group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-sm">🧞</span>
              </div>
              <span className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                Aladdin
              </span>
            </Link>
          </div>

          {/* 中间导航标签页 */}
          <nav className="hidden md:flex items-center">
            <div className="flex bg-gray-100 rounded-xl p-1 space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out
                    ${
                      isActiveRoute(item.path)
                        ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/10 transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm'
                    }
                  `}
                >
                  {item.label}
                  {/* 活跃状态指示器 */}
                  {isActiveRoute(item.path) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* 右侧用户信息 */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 钱包状态指示器 */}
            <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Connected</span>
            </div>
            
            {/* 用户头像和信息 */}
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <span className="text-white text-sm font-medium">👤</span>
              </div>
              <div className="hidden lg:block">
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">0x3301...1e53</span>
                <div className="text-xs text-gray-500">Wallet Connected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;