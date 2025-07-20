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
import { formatUnits, parseUnits } from 'viem'
import { MY_CONTRACT_ADDRESS, MY_CONTRACT_ABI } from '@/abis/contractABI'
import { ERC20_ABI } from "@/abis/ERC20ABI"

const WalletPage: React.FC = () => {
  // 钱包状态
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  // 表单状态
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [autoDepositAfterApproval, setAutoDepositAfterApproval] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null)

  // 显示通知
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // ETH 余额查询
  const { 
    data: ethBalance, 
    isLoading: ethBalanceLoading, 
    refetch: refetchEthBalance 
  } = useBalance({ 
    address: address,
    query: { 
      enabled: !!address 
    }
  })

  // 合约读取 - 获取 USDT 合约地址
  const { 
    data: contractUsdtAddress,
    isLoading: usdtAddressLoading 
  } = useReadContract({
    address: MY_CONTRACT_ADDRESS,
    abi: MY_CONTRACT_ABI,
    functionName: 'USDT',
    query: { 
      enabled: !!MY_CONTRACT_ADDRESS 
    }
  })

  // 查询用户对合约的 USDT 授权额度
  const { 
    data: allowance, 
    refetch: refetchAllowance,
    isLoading: allowanceLoading 
  } = useReadContract({
    address: contractUsdtAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && contractUsdtAddress ? [address, MY_CONTRACT_ADDRESS] : undefined,
    query: { 
      enabled: !!address && !!contractUsdtAddress 
    }
  })

  // 合约读取 - 用户在合约中的余额（使用 getBalance 函数）
  const { 
    data: userContractBalance, 
    refetch: refetchUserContractBalance,
    isLoading: userContractBalanceLoading,
    error: userBalanceError 
  } = useReadContract({
    address: MY_CONTRACT_ADDRESS,
    abi: MY_CONTRACT_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address && !!MY_CONTRACT_ADDRESS 
    }
  })

  // USDT 余额查询 - 使用从合约获取的 USDT 地址
  const { 
    data: usdtBalance, 
    isLoading: usdtBalanceLoading, 
    refetch: refetchUsdtBalance 
  } = useBalance({ 
    address: address,
    token: contractUsdtAddress as `0x${string}` | undefined,
    query: { 
      enabled: !!address && !!contractUsdtAddress 
    }
  })

  // 合约读取 - 合约总余额
  const { 
    data: contractTotalBalance, 
    refetch: refetchContractTotalBalance,
    isLoading: contractTotalBalanceLoading 
  } = useReadContract({
    address: MY_CONTRACT_ADDRESS,
    abi: MY_CONTRACT_ABI,
    functionName: 'getContractBalance',
    query: { 
      enabled: !!MY_CONTRACT_ADDRESS 
    }
  })

  // 合约读取 - 总存款
  const { 
    data: totalDeposits, 
    refetch: refetchTotalDeposits,
    isLoading: totalDepositsLoading 
  } = useReadContract({
    address: MY_CONTRACT_ADDRESS,
    abi: MY_CONTRACT_ABI,
    functionName: 'totalDeposits',
    query: { 
      enabled: !!MY_CONTRACT_ADDRESS 
    }
  })

  // 合约读取 - 用户存款记录（使用 deposits mapping）
  const { 
    data: userDeposits, 
    refetch: refetchUserDeposits,
    isLoading: userDepositsLoading 
  } = useReadContract({
    address: MY_CONTRACT_ADDRESS,
    abi: MY_CONTRACT_ABI,
    functionName: 'deposits',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address && !!MY_CONTRACT_ADDRESS 
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

  // 交易成功后刷新余额
  useEffect(() => {
    if (isConfirmed && txHash) {
      const refreshData = async () => {
        try {
          await Promise.all([
            refetchUserContractBalance(),
            refetchContractTotalBalance(),
            refetchUsdtBalance(),
            refetchTotalDeposits(),
            refetchEthBalance(),
            refetchAllowance(),
            refetchUserDeposits()
          ])
          
          // 如果是授权交易完成，且设置了自动存款标记
          if (autoDepositAfterApproval) {
            showNotification('success', '✅ 授权成功！正在自动执行存款...')
            setAutoDepositAfterApproval(false)
            
            // 等待一秒让授权数据更新
            setTimeout(() => {
              handleActualDeposit()
            }, 1000)
          } else {
            showNotification('success', '交易执行成功！')
            setDepositAmount('')
            setWithdrawAmount('')
          }
          
          resetWrite()
        } catch (error) {
          console.error('刷新数据失败:', error)
        }
      }
      refreshData()
    }
  }, [isConfirmed, txHash, autoDepositAfterApproval, refetchUserContractBalance, refetchContractTotalBalance, refetchUsdtBalance, refetchTotalDeposits, refetchEthBalance, refetchAllowance, refetchUserDeposits, resetWrite])

  // 处理错误
  useEffect(() => {
    if (writeError) {
      showNotification('error', `交易失败: ${writeError.message}`)
    }
    if (confirmError) {
      showNotification('error', `交易确认失败: ${confirmError.message}`)
    }
  }, [writeError, confirmError])

  // 授权方法 - 支持自定义金额和最大授权
  const handleApprove = async (amount?: string, isMaxApproval = false) => {
    if (!address || !contractUsdtAddress) {
      showNotification('error', '钱包未连接或USDT合约地址未获取')
      return
    }
    
    if (!isMaxApproval && !amount) {
      showNotification('error', '请输入有效的授权金额')
      return
    }
    
    try {
      let approveAmount: bigint
      
      if (isMaxApproval) {
        // 授权最大值 (2^256 - 1)
        approveAmount = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
        showNotification('info', '正在授权最大额度，这样您以后就不需要重复授权了...')
      } else {
        approveAmount = parseUnits(amount!, 6)
        showNotification('info', `正在授权 ${amount} USDT...`)
      }
      
      writeContract({
        address: contractUsdtAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [MY_CONTRACT_ADDRESS, approveAmount]
      })
      
    } catch (error) {
      console.error('授权错误:', error)
      showNotification('error', '授权失败，请重试')
    }
  }

  // 智能存款流程 - 自动检测是否需要授权
  const handleSmartDeposit = async () => {
    if (!depositAmount || !address) {
      showNotification('error', '请输入有效的存款金额')
      return
    }
    
    try {
      const amount = parseUnits(depositAmount, 6)
      
      // 检查 USDT 余额
      if (usdtBalance && amount > usdtBalance.value) {
        showNotification('error', 'USDT 余额不足')
        return
      }
      
      // 检查授权额度
      if (!allowance || allowance < amount) {
        showNotification('info', '🔄 第1步: 正在授权 USDT，请确认钱包交易...')
        
        // 自动授权最大额度，这样以后就不需要重复授权了
        writeContract({
          address: contractUsdtAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [MY_CONTRACT_ADDRESS, BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')]
        })
        
        // 设置标记，授权成功后自动进行存款
        setAutoDepositAfterApproval(true)
        return
      }
      
      // 授权充足，直接存款
      handleActualDeposit()
      
    } catch (error) {
      console.error('智能存款错误:', error)
      showNotification('error', '操作失败，请重试')
    }
  }

  // 实际执行存款
  const handleActualDeposit = async () => {
    if (!depositAmount || !address) return
    
    try {
      const amount = parseUnits(depositAmount, 6)
      
      showNotification('info', '💰 正在存款，请确认钱包交易...')
      
      writeContract({
        address: MY_CONTRACT_ADDRESS,
        abi: MY_CONTRACT_ABI,
        functionName: 'depositUSDT',
        args: [amount]
      })
      
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
      // USDT 通常使用 6 位小数
      const amount = parseUnits(withdrawAmount, 6)
      if (userContractBalance && amount > userContractBalance) {
        showNotification('error', '合约余额不足')
        return
      }
      
      writeContract({
        address: MY_CONTRACT_ADDRESS,
        abi: MY_CONTRACT_ABI,
        functionName: 'withdrawUSDT',
        args: [amount]
      })
      
      showNotification('info', 'USDT 提款交易已提交，请等待确认...')
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
      const parsedAmount = parseUnits(amount, 6)
      if (type === 'deposit') {
        // 存款时检查 USDT 余额
        if (!usdtBalance) return false
        return parsedAmount <= usdtBalance.value
      } else if (type === 'withdraw') {
        // 提款时检查合约余额
        if (!userContractBalance) return false
        return parsedAmount <= userContractBalance
      }
    } catch {
      return false
    }
    
    return false
  }

  // 调试信息
  console.log('Wallet Debug Info:', {
    isConnected,
    address,
    chainId,
    ethBalance: ethBalance?.value?.toString(),
    contractUsdtAddress,
    userContractBalance: userContractBalance?.toString(),
    userDeposits: userDeposits?.toString(),
    allowance: allowance?.toString()
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-3xl">🦊</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">连接钱包</h2>
          <div className="text-gray-600 mb-6">请在页面头部连接您的钱包以使用此功能</div>
          <div className="text-sm text-gray-500">
            调试信息: isConnected = {isConnected ? 'true' : 'false'}
          </div>
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
          <div className="text-gray-600 mt-2">管理您的 USDT 存款和提款</div>
        </div>

        {/* 网络警告 */}
        {chainId && chainId !== 11155111 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-600 text-lg mr-3">⚠️</span>
              <div>
                <h3 className="text-red-800 font-medium">网络不匹配</h3>
                <p className="text-red-600 text-sm mt-1">
                  你的合约部署在 Sepolia 测试网 (链ID: 11155111)，但当前连接的是其他网络 (链ID: {chainId})
                </p>
                <button
                  onClick={() => switchChain({ chainId: 11155111 })}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                >
                  切换到 Sepolia 测试网
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 调试信息 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">调试信息</h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <div>连接状态: {isConnected ? '✅ 已连接' : '❌ 未连接'}</div>
            <div>地址: {address || '未获取'}</div>
            <div>链ID: {chainId || '未获取'} {chainId === 11155111 ? '(Sepolia 测试网)' : chainId === 1 ? '(Ethereum 主网)' : '(其他网络)'}</div>
            <div>USDT合约地址: {contractUsdtAddress || '加载中...'}</div>
            <div>合约地址: {MY_CONTRACT_ADDRESS}</div>
            {chainId && chainId !== 11155111 && (
              <div className="text-red-600 font-medium">⚠️ 警告: 当前不在 Sepolia 测试网，请切换网络</div>
            )}
          </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">ETH 余额</h3>
              <div className="text-2xl font-bold text-blue-600">
                {ethBalanceLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    加载中...
                  </div>
                ) : ethBalance ? (
                  `${Number(formatUnits(ethBalance.value, 18)).toFixed(6)} ETH`
                ) : (
                  '0 ETH'
                )}
              </div>
            </div>

            {/* USDT 余额 */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">USDT 余额</h3>
              <div className="text-2xl font-bold text-green-600">
                {usdtBalanceLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    加载中...
                  </div>
                ) : usdtBalance ? (
                  `${Number(formatUnits(usdtBalance.value, 6)).toFixed(2)} USDT`
                ) : (
                  '0 USDT'
                )}
              </div>
            </div>
            
            {/* 合约中的 USDT 余额 (getBalance) */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">合约余额</h3>
              <div className="text-2xl font-bold text-yellow-600">
                {userContractBalanceLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    加载中...
                  </div>
                ) : userContractBalance ? (
                  `${Number(formatUnits(userContractBalance, 6)).toFixed(2)} USDT`
                ) : (
                  '0 USDT'
                )}
              </div>
            </div>

            {/* 用户存款记录 (deposits) */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">存款记录</h3>
              <div className="text-2xl font-bold text-orange-600">
                {userDepositsLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    加载中...
                  </div>
                ) : userDeposits ? (
                  `${Number(formatUnits(userDeposits, 6)).toFixed(2)} USDT`
                ) : (
                  '0 USDT'
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">合约地址</h3>
              <div className="text-sm font-mono mt-1 break-all">{MY_CONTRACT_ADDRESS}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">合约总余额</h3>
              <div className="text-xl font-semibold mt-1">
                {contractTotalBalanceLoading ? '加载中...' : 
                 contractTotalBalance ? `${Number(formatUnits(contractTotalBalance, 6)).toFixed(2)} USDT` : '0 USDT'}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">总存款量</h3>
              <div className="text-xl font-semibold mt-1">
                {totalDepositsLoading ? '加载中...' : 
                 totalDeposits ? `${Number(formatUnits(totalDeposits, 6)).toFixed(2)} USDT` : '0 USDT'}
              </div>
            </div>
          </div>
          
          {contractUsdtAddress && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-700">USDT 合约地址</h3>
              <div className="text-sm font-mono mt-1 break-all text-blue-600">{contractUsdtAddress}</div>
            </div>
          )}

          {/* 授权信息 */}
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-gray-700">USDT 授权额度</h3>
            <div className="text-lg font-semibold mt-1">
              {allowanceLoading ? '加载中...' : 
               allowance ? `${Number(formatUnits(allowance, 6)).toFixed(2)} USDT` : '0 USDT'}
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
                <h3 className="text-lg font-semibold text-gray-900">存款 USDT</h3>
                <div className="text-sm text-gray-600">将 USDT 存入智能合约</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  存款金额 (USDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="例如: 100.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div>可用余额: {usdtBalance ? Number(formatUnits(usdtBalance.value, 6)).toFixed(2) : '0'} USDT</div>
                <div>当前授权: {allowanceLoading ? '加载中...' : allowance ? Number(formatUnits(allowance, 6)).toFixed(2) : '0'} USDT</div>
              </div>

              {/* 智能存款说明 */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🧠</span>
                  <h4 className="font-medium text-blue-800">智能存款功能</h4>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>✅ 自动检测是否需要授权</div>
                  <div>✅ 一键完成授权 + 存款流程</div>
                  <div>✅ 首次使用会授权最大额度，后续存款无需重复授权</div>
                  <div className="text-xs text-blue-600 mt-2">
                    💡 只需点击下方按钮，系统会自动处理所有步骤！
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSmartDeposit}
                disabled={
                  !depositAmount || 
                  Number(depositAmount) <= 0 ||
                  !isValidAmount(depositAmount, 'deposit') || 
                  isWriting || 
                  isConfirming
                }
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              >
                {isWriting || isConfirming ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {autoDepositAfterApproval ? '步骤 1/2: 授权中...' : '处理中...'}
                  </div>
                ) : !depositAmount || Number(depositAmount) <= 0 ? (
                  '请输入金额'
                ) : !usdtBalance || parseUnits(depositAmount || '0', 6) > usdtBalance.value ? (
                  'USDT 余额不足'
                ) : depositAmount && allowance && parseUnits(depositAmount, 6) > allowance ? (
                  `🚀 一键存款 ${depositAmount} USDT (自动授权)`
                ) : (
                  `💰 存款 ${depositAmount} USDT`
                )}
              </button>

              {/* 进度提示 */}
              {autoDepositAfterApproval && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center text-blue-700">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-sm">
                      授权完成后将自动执行存款，请稍候...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 提款 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-lg">📤</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">提款 USDT</h3>
                <div className="text-sm text-gray-600">从智能合约提取 USDT</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  提款金额 (USDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="例如: 100.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                可提款余额: {userContractBalance ? Number(formatUnits(userContractBalance, 6)).toFixed(2) : '0'} USDT
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
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">交易详情</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">交易哈希</div>
                  <div className="text-sm text-gray-600 font-mono break-all">{txHash}</div>
                </div>
                <a
                  href={chainId === 11155111 ? `https://sepolia.etherscan.io/tx/${txHash}` : `https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  在 {chainId === 11155111 ? 'Sepolia ' : ''}Etherscan 查看 →
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
                <p className="text-red-600 text-sm mt-1">{writeError.message}</p>
              </div>
            )}
          </div>
        )}

        {/* 数据差异检查 */}
        {userContractBalance && userDeposits && userContractBalance !== userDeposits && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-800 font-medium mb-2">⚠️ 数据差异提醒</h3>
            <div className="text-yellow-700 text-sm space-y-1">
              <div>getBalance() 返回: {Number(formatUnits(userContractBalance, 6)).toFixed(2)} USDT</div>
              <div>deposits[用户] 返回: {Number(formatUnits(userDeposits, 6)).toFixed(2)} USDT</div>
              <div className="text-xs mt-2">
                这两个值应该相等。如果不同，可能是合约逻辑问题或数据同步问题。
              </div>
            </div>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h3>
          
          {/* 授权管理 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-yellow-800">🔐 USDT 授权管理</h4>
              <div className="text-sm text-yellow-700">
                当前: {allowance ? Number(formatUnits(allowance, 6)).toFixed(2) : '0'} USDT
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => handleApprove(undefined, true)}
                disabled={isWriting || isConfirming}
                className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {isWriting || isConfirming ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    授权中...
                  </div>
                ) : (
                  '🚀 一键授权最大额度'
                )}
              </button>
              
              <button
                onClick={() => handleApprove('0')}
                disabled={isWriting || isConfirming || !allowance || allowance === 0n}
                className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isWriting || isConfirming ? '处理中...' : '🔒 撤销授权'}
              </button>
            </div>
            
            <div className="mt-3 text-xs text-yellow-600">
              💡 推荐：使用"一键授权最大额度"可以避免每次存款都需要授权，节省Gas费用
            </div>
          </div>

          {/* 其他快捷操作 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setDepositAmount(usdtBalance ? formatUnits(usdtBalance.value, 6) : '0')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              存入全部 USDT
            </button>
            <button
              onClick={() => setWithdrawAmount(userContractBalance ? formatUnits(userContractBalance, 6) : '0')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              提取全部余额
            </button>
            <button
              onClick={() => {
                setDepositAmount('')
                setWithdrawAmount('')
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              清空输入
            </button>
          </div>
        </div>

        {/* 错误信息显示 */}
        {userBalanceError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-medium mb-2">❌ 获取用户余额失败</h3>
            <div className="text-red-700 text-sm">
              {userBalanceError.message}
            </div>
          </div>
        )}

        {/* 页脚信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">使用说明</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="font-medium text-green-600 mr-2">1.</span>
              <div>确保您的钱包连接到 Sepolia 测试网络</div>
            </div>
            <div className="flex items-start">
              <span className="font-medium text-green-600 mr-2">2.</span>
              <div>存款前需要先授权 USDT 给合约地址</div>
            </div>
            <div className="flex items-start">
              <span className="font-medium text-green-600 mr-2">3.</span>
              <div>存款和提款操作都需要支付少量 ETH 作为 Gas 费用</div>
            </div>
            <div className="flex items-start">
              <span className="font-medium text-green-600 mr-2">4.</span>
              <div>交易确认后，余额会自动刷新</div>
            </div>
            <div className="flex items-start">
              <span className="font-medium text-green-600 mr-2">5.</span>
              <div>如果遇到问题，请检查调试信息或联系技术支持</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">技术参数</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>USDT 精度: 6 位小数</div>
              <div>ETH 精度: 18 位小数</div>
              <div>合约网络: Sepolia 测试网</div>
              <div>Gas 费用: 动态计算</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletPage