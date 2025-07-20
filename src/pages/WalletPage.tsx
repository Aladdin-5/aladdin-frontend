import React, { useState, useEffect } from 'react'
import { 
  useAccount, 
  useBalance, 
  useDisconnect, 
  useChainId, 
  useSwitchChain,
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { MY_CONTRACT_ADDRESS, MY_CONTRACT_ABI, contractConfig } from '@/abis/contractABI'

const WalletPage: React.FC = () => {
  // 钱包状态
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  // 余额查询
  const { 
    data: ethBalance, 
    isLoading: ethBalanceLoading, 
    refetch: refetchEthBalance 
  } = useBalance({ 
    address: address as `0x${string}` | undefined,
    query: { 
      enabled: !!address 
    }
  })
  
  // 合约读取
  const { 
    data: userBalance, 
    refetch: refetchUserBalance,
    isLoading: userBalanceLoading,
    error: userBalanceError 
  } = useReadContract({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'getBalance',
    account: address as `0x${string}` | undefined,
    query: { 
      enabled: !!address && !!contractConfig.address 
    }
  })

  const { 
    data: contractBalance, 
    refetch: refetchContractBalance,
    isLoading: contractBalanceLoading 
  } = useReadContract({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: 'getContractBalance',
    query: { 
      enabled: !!contractConfig.address 
    }
  })

  // 合约写入
  const { 
    data: txHash, 
    writeContract, 
    isPending: isWriting,
    error: writeError,
    reset: resetWrite 
  } = useWriteContract()

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError 
  } = useWaitForTransactionReceipt({ 
    hash: txHash,
    query: { 
      enabled: !!txHash 
    }
  })

  // 表单状态
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null)

  // 显示通知
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // 交易成功后刷新余额
  useEffect(() => {
    if (isConfirmed && txHash) {
      const refreshData = async () => {
        try {
          await Promise.all([
            refetchUserBalance(),
            refetchContractBalance(),
            refetchEthBalance()
          ])
          showNotification('success', '交易执行成功！')
          setDepositAmount('')
          setWithdrawAmount('')
          resetWrite()
        } catch (error) {
          console.error('刷新数据失败:', error)
        }
      }
      refreshData()
    }
  }, [isConfirmed, txHash, refetchUserBalance, refetchContractBalance, refetchEthBalance, resetWrite])

  // 处理错误
  useEffect(() => {
    if (writeError) {
      showNotification('error', `交易失败: ${writeError.message}`)
    }
    if (confirmError) {
      showNotification('error', `交易确认失败: ${confirmError.message}`)
    }
  }, [writeError, confirmError])

  // 存款方法
  const handleDeposit = async () => {
    if (!depositAmount || !address) {
      showNotification('error', '请输入有效的存款金额')
      return
    }
    
    try {
      const amount = parseEther(depositAmount)
      if (ethBalance && amount > ethBalance.value) {
        showNotification('error', 'ETH 余额不足')
        return
      }
      
      writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'deposit',
        value: amount
      })
      
      showNotification('info', '存款交易已提交，请等待确认...')
    } catch (error) {
      console.error('存款错误:', error)
      showNotification('error', '存款失败，请重试')
    }
  }

  // 提款方法
  const handleWithdraw = async () => {
    if (!withdrawAmount || !address) {
      showNotification('error', '请输入有效的提款金额')
      return
    }
    
    try {
      const amount = parseEther(withdrawAmount)
      if (userBalance && amount > userBalance) {
        showNotification('error', '合约余额不足')
        return
      }
      
      writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'withdraw',
        args: [amount]
      })
      
      showNotification('info', '提款交易已提交，请等待确认...')
    } catch (error) {
      console.error('提款错误:', error)
      showNotification('error', '提款失败，请重试')
    }
  }

  // 复制地址
  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        showNotification('success', '地址已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
      }
    }
  }

  // 验证输入金额
  const isValidAmount = (amount: string, type: 'deposit' | 'withdraw') => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return false
    
    try {
      const parsedAmount = parseEther(amount)
      if (type === 'deposit' && ethBalance) {
        return parsedAmount <= ethBalance.value
      } else if (type === 'withdraw' && userBalance) {
        return parsedAmount <= userBalance
      }
    } catch {
      return false
    }
    
    return true
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-3xl">🦊</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">连接钱包</h2>
          <div className="text-gray-600 mb-6">请在页面头部连接您的钱包以使用此功能</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 通知组件 */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="text-sm">{notification.message}</div>
              <button 
                onClick={() => setNotification(null)}
                className="ml-3 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">钱包管理</h1>
          <div className="text-gray-600 mt-2">管理您的 ETH 存款和提款</div>
        </div>

        {/* 用户信息卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">账户信息</h2>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">已连接</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 钱包地址 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">钱包地址</h3>
              <div className="text-sm font-mono break-all text-gray-900">
                {address}
              </div>
              <button
                onClick={copyAddress}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800"
              >
                复制地址
              </button>
            </div>
            
            {/* ETH 余额 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">钱包余额</h3>
              <div className="text-2xl font-bold text-blue-600">
                {ethBalanceLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    加载中...
                  </div>
                ) : ethBalance ? (
                  `${Number(formatEther(ethBalance.value)).toFixed(6)} ETH`
                ) : (
                  '0 ETH'
                )}
              </div>
            </div>
            
            {/* 合约余额 */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">合约余额</h3>
              <div className="text-2xl font-bold text-green-600">
                {userBalanceLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    加载中...
                  </div>
                ) : userBalance ? (
                  `${formatEther(userBalance)} ETH`
                ) : (
                  '0 ETH'
                )}
              </div>
            </div>
            
            {/* 网络信息 */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">当前网络</h3>
              <div className="text-lg font-semibold text-purple-600">
                Chain: {chainId}
              </div>
              {chainId !== 11155111 && (
                <button
                  onClick={() => switchChain({ chainId: 11155111 })}
                  className="mt-2 text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                >
                  切换到 Sepolia
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 合约信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">合约信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">合约地址</h3>
              <div className="text-sm font-mono mt-1 break-all">{MY_CONTRACT_ADDRESS}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">合约总余额</h3>
              <div className="text-xl font-semibold mt-1">
                {contractBalanceLoading ? '加载中...' : 
                 contractBalance ? `${formatEther(contractBalance)} ETH` : '0 ETH'}
              </div>
            </div>
          </div>
        </div>

        {/* 操作区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 存款 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-lg">📥</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">存款 ETH</h3>
                <div className="text-sm text-gray-600">将 ETH 存入智能合约</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  存款金额 (ETH)
                </label>
                <input
                  type="number"
                  placeholder="例如: 0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <button
                onClick={handleDeposit}
                disabled={!isValidAmount(depositAmount, 'deposit') || isWriting || isConfirming}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isWriting || isConfirming ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    处理中...
                  </div>
                ) : (
                  '存款'
                )}
              </button>
            </div>
          </div>

          {/* 提款 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-lg">📤</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">提款 ETH</h3>
                <div className="text-sm text-gray-600">从智能合约提取 ETH</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  提款金额 (ETH)
                </label>
                <input
                  type="number"
                  placeholder="例如: 0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                可提款余额: {userBalance ? formatEther(userBalance) : '0'} ETH
              </div>
              
              <button
                onClick={handleWithdraw}
                disabled={!isValidAmount(withdrawAmount, 'withdraw') || isWriting || isConfirming}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isWriting || isConfirming ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    处理中...
                  </div>
                ) : (
                  '提款'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 交易状态 */}
        {txHash && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">交易详情</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">交易哈希</div>
                  <div className="text-sm text-gray-600 font-mono break-all">{txHash}</div>
                </div>
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  在 Etherscan 查看 →
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-700">状态:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  isConfirmed 
                    ? 'bg-green-100 text-green-800' 
                    : isConfirming 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {isConfirmed ? '✅ 交易成功' : isConfirming ? '⏳ 确认中...' : '⏸️ 待处理'}
                </span>
              </div>
            </div>
            
            {writeError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-red-800 font-medium flex items-center">
                  <span className="mr-2">❌</span>
                  交易失败
                </h4>
                {/* <p className="text-red-600 text-sm mt-1">{writeError.message}</p> */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletPage