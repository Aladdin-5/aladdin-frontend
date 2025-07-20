import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import WalletButton from './WalletButton';

const Header: React.FC = () => {
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
          <div className="flex items-center">
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;