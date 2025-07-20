import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Button,
  Card,
  Typography,
  Space,
  InputNumber,
  Tooltip,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CreateJobRequest } from "@/types/jobs/index";
import jobsApi from "@/api/jobsApi";
import { 
  useAccount, 
  useBalance, 
  useChainId, 
  useSwitchChain,
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { MY_CONTRACT_ADDRESS, MY_CONTRACT_ABI } from '@/abis/contractABI'
import { ERC20_ABI } from "@/abis/ERC20ABI"
const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const JobCreationForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<string>("Fixed Price");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [autoAssign, setAutoAssign] = useState<boolean>(false);
  const [allowBidding, setAllowBidding] = useState<boolean>(true);
  const [escrowEnabled, setEscrowEnabled] = useState<boolean>(true);
  const [allowParallelExecution, setAllowParallelExecution] =
    useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  // 存款相关状态
  const [depositAmount, setDepositAmount] = useState('')
  const [autoDepositAfterApproval, setAutoDepositAfterApproval] = useState(false)
  const [isJobCreationDeposit, setIsJobCreationDeposit] = useState(false) // 标记是否为任务创建后的托管
  const [depositNotification, setDepositNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null)

  // 钱包状态
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // 显示存款通知
  const showDepositNotification = (type: 'success' | 'error' | 'info', msg: string) => {
    setDepositNotification({ type, message: msg })
    setTimeout(() => setDepositNotification(null), 5000)
    // 同时显示 antd message
    if (type === 'success') message.success(msg)
    else if (type === 'error') message.error(msg)
    else message.info(msg)
  }

  // 获取 USDT 合约地址
  const { 
    data: contractUsdtAddress,
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

  // USDT 余额查询
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

  // 交易成功后处理
  useEffect(() => {
    if (isConfirmed && txHash) {
      const refreshData = async () => {
        try {
          await Promise.all([
            refetchUsdtBalance(),
            refetchAllowance(),
          ])
          
          if (autoDepositAfterApproval) {
            // 手动存款流程：授权后自动存款
            showDepositNotification('success', '✅ 授权成功！正在自动执行存款...')
            setAutoDepositAfterApproval(false)
            setTimeout(() => {
              handleActualDeposit()
            }, 1000)
          } else if (isJobCreationDeposit) {
            // 任务创建后的资金托管完成
            showDepositNotification('success', '🎉 资金托管成功！任务已创建并完成资金托管')
            message.success('任务创建并资金托管完成，正在跳转...')
            setDepositAmount('')
            setIsJobCreationDeposit(false)
            
            // 延迟导航，让用户看到成功消息
            setTimeout(() => {
              navigate("/jobs");
            }, 2000);
          } else {
            // 普通的手动存款完成
            showDepositNotification('success', '存款成功！资金已托管到智能合约')
            setDepositAmount('')
          }
          
          resetWrite()
        } catch (error) {
          console.error('刷新数据失败:', error)
        }
      }
      refreshData()
    }
  }, [isConfirmed, txHash, autoDepositAfterApproval, isJobCreationDeposit, navigate])

  // 处理错误
  useEffect(() => {
    if (writeError) {
      showDepositNotification('error', `交易失败: ${writeError.message}`)
    }
    if (confirmError) {
      showDepositNotification('error', `交易确认失败: ${confirmError.message}`)
    }
  }, [writeError, confirmError])

  // 实际执行存款
  const handleActualDeposit = async () => {
    if (!depositAmount || !address) return
    
    try {
      const amount = parseUnits(depositAmount, 6)
      
      showDepositNotification('info', '💰 正在存款到托管合约，请确认钱包交易...')
      
      writeContract({
        address: MY_CONTRACT_ADDRESS,
        abi: MY_CONTRACT_ABI,
        functionName: 'depositUSDT',
        args: [amount]
      })
      
    } catch (error) {
      console.error('存款错误:', error)
      showDepositNotification('error', '存款失败，请重试')
    }
  }

  // 获取预算最大值作为存款金额
  const getBudgetMaxForDeposit = (): string => {
    const formValues = form.getFieldsValue();
    
    if (paymentType === "Free Jobs") {
      return "50"; // Free Jobs 固定 50 USDT
    }
    
    if (formValues.budgetMax && Number(formValues.budgetMax) > 0) {
      return formValues.budgetMax.toString();
    }
    
    return "0";
  };

  // 自动设置存款金额为预算最大值
  const autoSetDepositAmount = () => {
    const maxBudget = getBudgetMaxForDeposit();
    if (maxBudget && Number(maxBudget) > 0) {
      setDepositAmount(maxBudget);
      showDepositNotification('info', `已自动设置托管金额为预算最大值: ${maxBudget} USDT`);
    }
  };

  // 监听表单变化，自动更新存款金额
  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.budgetMax || changedValues.paymentType) {
      // 当预算最大值或支付类型改变时，自动更新存款金额
      setTimeout(() => {
        const maxBudget = getBudgetMaxForDeposit();
        if (maxBudget && Number(maxBudget) > 0) {
          setDepositAmount(maxBudget);
        }
      }, 100);
    }
  };

  const paymentOptions = [
    "Fixed Price",
    "Hourly Rate",
    "Pay Per Task",
    "Free Jobs",
  ];

  const categories = [
    "Personal Assistant",
    "Visual Designer",
    "Marketing Expert",
    "Biotech Analyst",
    "Financial Analyst",
    "Mathematician",
    "Prediction Market Analyst",
    "Software",
    "Web Development",
    "Graphic Design",
    "Content Writing",
    "Data Analysis",
    "Mobile Development",
  ];

  const priorities = ["Low", "Medium", "High", "Urgent"];
  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  // Get current wallet address
  const getCurrentWalletAddress = (): string => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }
    return address;
  };

  const handlePaymentTypeChange = (value: React.SetStateAction<string>) => {
    setPaymentType(value);
    form.setFieldsValue({
      budgetMin: undefined,
      budgetMax: undefined,
    });
  };

  const handleTagAdd = (): void => {
    const trimmedInput = tagInput.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      setTags((prevTags) => [...prevTags, trimmedInput]);
      setTagInput("");
      form.validateFields(["tags"]);
    }
  };

  const handleTagRemove = (tagToRemove: string): void => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    form.validateFields(["tags"]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const onFinish = async (values: any) => {
    try {
      // 检查标签
      if (tags.length === 0) {
        message.error("Please add at least one tag");
        return;
      }

      // 检查钱包连接状态
      if (!isConnected || !address) {
        message.error("Please connect your wallet first to create a job");
        return;
      }

      // 检查网络
      if (chainId && chainId !== 11155111) {
        message.error("Please switch to Sepolia testnet to create a job");
        return;
      }

      setLoading(true);

      // 准备预算数据
      let budget: number | { min: number; max: number };
      let escrowAmount = 0; // 托管金额

      if (paymentType === "Free Jobs") {
        budget = 50;
        escrowAmount = 50; // Free Jobs 托管 50 USDT
      } else {
        if (values.budgetMin && values.budgetMax) {
          budget = { min: values.budgetMin, max: values.budgetMax };
          escrowAmount = values.budgetMax; // 使用预算最大值作为托管金额
        } else if (values.budgetMin) {
          budget = values.budgetMin;
          escrowAmount = values.budgetMin;
        } else {
          budget = 0;
          escrowAmount = 0;
        }
      }

      // 如果启用了资金托管，先检查条件
      if (escrowEnabled && escrowAmount > 0) {
        // 检查 USDT 余额
        if (usdtBalance) {
          const requiredAmount = parseUnits(escrowAmount.toString(), 6);
          if (requiredAmount > usdtBalance.value) {
            message.error(`USDT 余额不足。需要 ${escrowAmount} USDT，当前余额 ${Number(formatUnits(usdtBalance.value, 6)).toFixed(2)} USDT`);
            setLoading(false);
            return;
          }
        }

        // 检查授权额度
        if (allowance) {
          const requiredAmount = parseUnits(escrowAmount.toString(), 6);
          if (allowance < requiredAmount) {
            message.error(`授权额度不足。需要先授权 ${escrowAmount} USDT 给合约`);
            setLoading(false);
            return;
          }
        }
      }

      const jobData: CreateJobRequest = {
        jobTitle: values.jobTitle,
        category: values.category,
        description: values.description,
        deliverables: values.deliverables,
        budget,
        deadline: values.deadline.toISOString(),
        paymentType,
        priority: values.priority,
        skillLevel: values.skillLevel,
        tags,
        autoAssign,
        allowBidding,
        allowParallelExecution,
        escrowEnabled,
        isPublic,
        walletAddress: getCurrentWalletAddress(), // 使用真实钱包地址
      };

      // 🎯 第一步：调用 API 创建任务
      message.info("正在创建任务...");
      const createdJob = await jobsApi.createJob(jobData);
      message.success("Job created successfully!");
      
      console.log("Created job:", createdJob);
      console.log("Wallet address used:", getCurrentWalletAddress());
      console.log("Escrow amount:", escrowAmount);

      // 🎯 第二步：API 调用成功后，执行资金托管
      if (escrowEnabled && escrowAmount > 0) {
        try {
          message.info(`任务创建成功！正在托管 ${escrowAmount} USDT 到智能合约...`);
          
          const amount = parseUnits(escrowAmount.toString(), 6);
          
          // 设置标识，表示这是任务创建后的自动托管
          setIsJobCreationDeposit(true);
          setAutoDepositAfterApproval(false); // 重置自动存款标记
          
          // 调用智能合约存款
          writeContract({
            address: MY_CONTRACT_ADDRESS,
            abi: MY_CONTRACT_ABI,
            functionName: 'depositUSDT',
            args: [amount]
          });
          
          showDepositNotification('info', `正在执行资金托管 ${escrowAmount} USDT，请确认钱包交易...`);
          
        } catch (escrowError) {
          console.error('资金托管失败:', escrowError);
          message.warning(`任务创建成功，但资金托管失败：${escrowError instanceof Error ? escrowError.message : '未知错误'}。您可以稍后手动托管资金。`);
          // 即使托管失败，也导航到任务列表，因为任务已经创建成功
          navigate("/jobs");
        }
      } else {
        // 如果没有启用托管，直接导航
        navigate("/jobs");
      }

    } catch (error) {
      console.error("Error creating job:", error);
      
      // 针对钱包错误的特殊处理
      if (error instanceof Error && error.message.includes("Wallet not connected")) {
        message.error("Please connect your wallet to create a job");
      } else {
        message.error(
          error instanceof Error ? error.message : "Failed to create job"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentSection = () => {
    if (paymentType === "Free Jobs") {
      return (
        <Form.Item
          label={
            <Space>
              <span className="font-medium">Budget Range</span>
              <Tooltip title="Budget range for the project">
                <QuestionCircleOutlined className="text-gray-400" />
              </Tooltip>
            </Space>
          }
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          className="mb-6"
        >
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <Text strong className="text-gray-800">
                  50 USDT (Deposit)
                </Text>
                <Text type="secondary" className="text-sm">
                  Refunded after task completion
                </Text>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <InfoCircleOutlined />
              <span>
                Free agents require 50 USDT deposit, automatically refunded
                after task acceptance
              </span>
            </div>
          </div>
        </Form.Item>
      );
    }

    return (
      <Form.Item
        label={
          <Space>
            <span className="font-medium">Budget Range</span>
            <Tooltip title="Set your budget range for this project">
              <QuestionCircleOutlined className="text-gray-400" />
            </Tooltip>
          </Space>
        }
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        className="mb-6"
        required
      >
        <div className="flex items-center space-x-4">
          <Form.Item
            name="budgetMin"
            noStyle
            rules={[{ required: true, message: "Please enter minimum budget" }]}
          >
            <InputNumber
              placeholder="100"
              className="w-40"
              min={0}
              controls={false}
            />
          </Form.Item>
          <Text type="secondary" className="text-sm">
            USDT
          </Text>
          <Text type="secondary" className="mx-2">
            -
          </Text>
          <Form.Item
            name="budgetMax"
            noStyle
            rules={[{ required: true, message: "Please enter maximum budget" }]}
          >
            <InputNumber
              placeholder="500"
              className="w-40"
              min={0}
              controls={false}
            />
          </Form.Item>
          <Text type="secondary" className="text-sm">
            USDT
          </Text>
        </div>
      </Form.Item>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-0 backdrop-blur-sm bg-white/80">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Create Job
            </h1>
            
            {/* 钱包连接状态显示 */}
            {isConnected && address ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <Text className="text-green-700 font-medium">钱包已连接</Text>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Text type="secondary" className="text-sm">地址:</Text>
                    <Text className="font-mono text-sm text-green-700">
                      {`${address.slice(0, 6)}...${address.slice(-4)}`}
                    </Text>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        navigator.clipboard.writeText(address);
                        message.success("钱包地址已复制到剪贴板");
                      }}
                      className="p-0 h-auto text-green-600 hover:text-green-800"
                    >
                      复制
                    </Button>
                  </div>
                </div>
                {chainId && chainId !== 11155111 && (
                  <div className="mt-2 flex items-center space-x-2 text-orange-600">
                    <InfoCircleOutlined />
                    <Text className="text-sm">
                      请切换到 Sepolia 测试网络以创建任务
                    </Text>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <InfoCircleOutlined className="text-yellow-600" />
                  <Text className="text-yellow-700">
                    请先连接钱包以创建任务和进行资金托管
                  </Text>
                </div>
              </div>
            )}
            
            <div className="space-y-2 text-sm text-blue-600">
              <div className="flex items-center space-x-2">
                <InfoCircleOutlined />
                <span>
                  After job posting, funds will be escrowed by Aladdin Protocol
                  smart contract to ensure transaction security.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <InfoCircleOutlined />
                <span>
                  Upon task completion by AI Agent, the system will
                  automatically verify results and release funds.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <InfoCircleOutlined />
                <span>
                  In case of disputes, fair arbitration will be conducted by the
                  DAO committee.
                </span>
              </div>
            </div>
          </div>

          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            onFinish={onFinish}
            onValuesChange={handleFormValuesChange}
            className="space-y-6"
          >
            <Form.Item
              label={<span className="font-medium">Job Title</span>}
              name="jobTitle"
              rules={[{ required: true, message: "Job title is required" }]}
            >
              <Input
                placeholder="Enter job title, e.g., Develop a data analysis tool"
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium">Category</span>}
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select category"
                className="h-10"
                suffixIcon={<InfoCircleOutlined className="text-gray-400" />}
              >
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span className="font-medium">Tags</span>
                  <Tooltip title="Add relevant tags to help agents find your job">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </Space>
              }
              name="tags"
              rules={[
                {
                  validator: () => {
                    if (tags.length === 0) {
                      return Promise.reject(
                        new Error("Please add at least one tag")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              required
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter relevant tags and press Enter to add, e.g., Python, Data Analysis, API"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-10"
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleTagAdd}
                    disabled={!tagInput.trim()}
                    className="h-10"
                    style={{
                      backgroundColor: "#1677ff",
                      borderColor: "#1677ff",
                      color: "#fff",
                    }}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                        onClick={() => handleTagRemove(tag)}
                      >
                        {tag} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Form.Item>

            <Form.Item
              label={<span className="font-medium">Detailed Description</span>}
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please provide a detailed description",
                },
              ]}
            >
              <TextArea
                placeholder="Describe task requirements, technical specifications, expected outcomes in detail."
                rows={6}
                className="resize-none"
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span className="font-medium">Payment Type</span>
                  <Tooltip title="Choose how you want to pay for this job">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </Space>
              }
              name="paymentType"
              initialValue="Fixed Price"
              rules={[
                { required: true, message: "Please select payment type" },
              ]}
            >
              <Select
                value={paymentType}
                onChange={handlePaymentTypeChange}
                className="h-10"
              >
                {paymentOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {renderPaymentSection()}

            <Form.Item
              label={<span className="font-medium">Deadline</span>}
              name="deadline"
              rules={[{ required: true, message: "Please set a deadline" }]}
            >
              <DatePicker
                placeholder="Select deadline"
                className="w-full h-10"
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span className="font-medium">Priority</span>
                  <Tooltip title="Set the priority level for this job">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </Space>
              }
              name="priority"
              rules={[{ required: true, message: "Please select priority" }]}
            >
              <Select placeholder="Select priority" className="h-10">
                {priorities.map((priority) => (
                  <Option key={priority} value={priority}>
                    {priority}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span className="font-medium">Skill Requirements</span>
                  <Tooltip title="Required skill level for this job">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </Space>
              }
              name="skillLevel"
              rules={[{ required: true, message: "Please select skill level" }]}
            >
              <Select
                placeholder="Select required skill level"
                className="h-10"
              >
                {skillLevels.map((level) => (
                  <Option key={level} value={level}>
                    {level}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium">Deliverable Requirements</span>
              }
              name="deliverables"
              rules={[
                {
                  required: true,
                  message: "Please describe deliverable requirements",
                },
              ]}
            >
              <TextArea
                placeholder="Clearly list expected deliverables, e.g., Complete source code, deployment documentation, user manual, etc."
                rows={4}
                className="resize-none"
              />
            </Form.Item>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center space-x-2 mb-6">
                <InfoCircleOutlined className="text-blue-500 text-lg" />
                <Text strong className="text-gray-800 text-base">
                  Advanced Options
                </Text>
              </div>

              <div className="space-y-5">
                <div className="flex items-center">
                  <div className="flex items-center space-x-3 w-48">
                    <Text className="font-medium text-gray-800">
                      Auto Assign
                    </Text>
                    <Tooltip title="Automatically assign to qualified agents">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={autoAssign}
                      onChange={setAutoAssign}
                      style={{
                        backgroundColor: autoAssign ? "#3b82f6" : "#d1d5db",
                        borderColor: autoAssign ? "#3b82f6" : "#d1d5db",
                      }}
                    />
                    <Text type="secondary" className="text-sm">
                      {autoAssign ? "Auto assign enabled" : "Manual selection"}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center space-x-3 w-48">
                    <Text className="font-medium text-gray-800">
                      Allow Bidding
                    </Text>
                    <Tooltip title="Allow agents to bid on this job">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={allowBidding}
                      onChange={setAllowBidding}
                      style={{
                        backgroundColor: allowBidding ? "#3b82f6" : "#d1d5db",
                        borderColor: allowBidding ? "#3b82f6" : "#d1d5db",
                      }}
                    />
                    <Text type="secondary" className="text-sm">
                      {allowBidding ? "Bidding enabled" : "Bidding disabled"}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center space-x-3 w-48">
                    <Text className="font-medium text-gray-800">
                      Enable Fund Escrow
                    </Text>
                    <Tooltip title="Deposit funds to escrow for security">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={escrowEnabled}
                      onChange={setEscrowEnabled}
                      style={{
                        backgroundColor: escrowEnabled ? "#3b82f6" : "#d1d5db",
                        borderColor: escrowEnabled ? "#3b82f6" : "#d1d5db",
                      }}
                    />
                    <Text type="secondary" className="text-sm">
                      {escrowEnabled ? "Escrow enabled" : "Escrow disabled"}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center space-x-3 w-48">
                    <Text className="font-medium text-gray-800">
                      Parallel Execution
                    </Text>
                    <Tooltip title="Allow multiple agents to work on this job">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={allowParallelExecution}
                      onChange={setAllowParallelExecution}
                      style={{
                        backgroundColor: allowParallelExecution
                          ? "#3b82f6"
                          : "#d1d5db",
                        borderColor: allowParallelExecution
                          ? "#3b82f6"
                          : "#d1d5db",
                      }}
                    />
                    <Text type="secondary" className="text-sm">
                      {allowParallelExecution
                        ? "Multiple agents allowed"
                        : "Single agent only"}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center space-x-3 w-48">
                    <Text className="font-medium text-gray-800">
                      Public Job
                    </Text>
                    <Tooltip title="Make this job visible to all agents">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={isPublic}
                      onChange={setIsPublic}
                      style={{
                        backgroundColor: isPublic ? "#3b82f6" : "#d1d5db",
                        borderColor: isPublic ? "#3b82f6" : "#d1d5db",
                      }}
                    />
                    <Text type="secondary" className="text-sm">
                      {isPublic ? "Visible to all" : "Private job"}
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                size="large"
                className="px-8"
                onClick={() => form.resetFields()}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => form.submit()}
                className="px-8"
                loading={loading}
                style={{
                  backgroundColor: "#1677ff",
                  borderColor: "#1677ff",
                  color: "#fff",
                }}
              >
                Create Job →
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default JobCreationForm;