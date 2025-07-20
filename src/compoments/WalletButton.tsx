import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { formatEther } from 'viem';

const WalletButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance, isLoading: balanceLoading } = useBalance({ 
    address: address as `0x${string}` | undefined 
  });
  
  const [showDropdown, setShowDropdown] = useState(false);

  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 处理连接
  const handleConnect = (connector: any) => {
    connect({ connector });
    setShowDropdown(false);
  };

  // 处理断开连接
  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
  };

  // 复制地址
  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
      } catch (error) {
        console.error('复制失败:', error);
      }
    }
  };

  // 如果未连接钱包，显示连接按钮
  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isPending && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          <span>{isPending ? '连接中...' : '连接钱包'}</span>
        </button>
        
        {/* 连接器选择下拉菜单 */}
        {showDropdown && (
          <>
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="text-sm font-medium text-gray-700 px-3 py-2 border-b">
                  选择钱包
                </div>
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    disabled={isPending}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3 disabled:opacity-50"
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      {connector.name.includes('MetaMask') && '🦊'}
                      {connector.name.includes('WalletConnect') && '🔗'}
                      {connector.name.includes('Coinbase') && '🔵'}
                      {!connector.name.includes('MetaMask') && 
                       !connector.name.includes('WalletConnect') && 
                       !connector.name.includes('Coinbase') && '👛'}
                    </div>
                    <span>{connector.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* 点击外部关闭下拉菜单 */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)}
            />
          </>
        )}
      </div>
    );
  }

  // 已连接状态显示
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-3"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="font-mono text-sm">{formatAddress(address!)}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 用户信息下拉菜单 */}
      {showDropdown && (
        <>
          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              {/* 账户信息 */}
              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">👛</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">钱包已连接</div>
                    <div className="text-xs text-gray-500">点击下方断开连接</div>
                  </div>
                </div>
                
                {/* 地址 */}
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <div className="text-xs text-gray-600 mb-1">钱包地址</div>
                  <div className="font-mono text-sm text-gray-900 break-all">{address}</div>
                  <button
                    onClick={copyAddress}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                  >
                    复制地址
                  </button>
                </div>
                
                {/* 余额 */}
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="text-xs text-gray-600 mb-1">ETH 余额</div>
                  <div className="font-semibold text-blue-600">
                    {balanceLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        加载中...
                      </div>
                    ) : balance ? (
                      `${Number(formatEther(balance.value)).toFixed(6)} ETH`
                    ) : (
                      '0 ETH'
                    )}
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="space-y-2">
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                >
                  断开连接
                </button>
              </div>
            </div>
          </div>
          {/* 点击外部关闭下拉菜单 */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
        </>
      )}
    </div>
  );
};

export default WalletButton;