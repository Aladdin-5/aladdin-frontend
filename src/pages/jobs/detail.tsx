import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Badge,
  Card,
  Tag,
  message,
  Spin,
  Alert,
  Progress,
  Statistic,
} from "antd";
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  CopyOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  WalletOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import jobsApi from "@/api/jobsApi";
import type { JobDetailResponse } from "@/types/jobs/index";

const { Content } = Layout;

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { address, isConnected, isLoading: walletLoading } = useAccount();
  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobDetailResponse | null>(null);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);

  // 状态映射
  const getStatusConfig = (status: string) => {
    const configs = {
      COMPLETED: {
        color: "success",
        text: "Completed",
        icon: <CheckCircleOutlined />,
      },
      IN_PROGRESS: {
        color: "processing",
        text: "In Progress",
        icon: <LoadingOutlined />,
      },
      OPEN: { color: "default", text: "Open", icon: <ClockCircleOutlined /> },
      CANCELLED: {
        color: "error",
        text: "Cancelled",
        icon: <ExclamationCircleOutlined />,
      },
      EXPIRED: {
        color: "warning",
        text: "Expired",
        icon: <ExclamationCircleOutlined />,
      },
      FAILED: {
        color: "error",
        text: "Failed",
        icon: <ExclamationCircleOutlined />,
      },
      ASSIGNED: {
        color: "processing",
        text: "Assigned",
        icon: <ClockCircleOutlined />,
      },
    };
    return configs[status as keyof typeof configs] || configs.OPEN;
  };

  // 格式化时间
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  // 格式化执行时间
  const formatExecutionTime = (timeMs: number) => {
    if (timeMs < 1000) return `${timeMs}ms`;
    if (timeMs < 60000) return `${(timeMs / 1000).toFixed(1)}s`;
    return `${(timeMs / 60000).toFixed(1)}m`;
  };

  // 解析执行结果
  const parseExecutionResult = (resultString: string) => {
    try {
      const parsed = JSON.parse(resultString);
      return {
        text: parsed.text || resultString,
        usage: parsed.usage,
        finishReason: parsed.finishReason,
        warnings: parsed.warnings || [],
      };
    } catch (error) {
      return { text: resultString };
    }
  };

  // 钱包加载中
  if (walletLoading) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content className="flex justify-center items-center">
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  // 未连接钱包
  if (!isConnected || !address) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-2xl mx-auto">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/dashboard")}
              className="mb-6"
            >
              Back to Dashboard
            </Button>

            <Alert
              message="Wallet Not Connected"
              description="Please connect your wallet to view job details."
              type="warning"
              showIcon
              icon={<WalletOutlined />}
            />
          </div>
        </Content>
      </Layout>
    );
  }

  // 加载任务详情
  const loadJobDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await jobsApi.getJobDetails(id);

      if (response.data) {
        setJobDetails(response.data);
        // 默认选择第一个有结果的 agent
        const firstCompletedIndex = response.data.results.findIndex(
          (result) => result.workStatus === "COMPLETED"
        );
        setSelectedAgentIndex(
          firstCompletedIndex >= 0 ? firstCompletedIndex : 0
        );
      } else {
        message.error("Job not found");
        // navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error loading job details:", error);
      message.error("Failed to load job details");
      // navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId && address) {
      loadJobDetails(jobId);
    }
  }, [jobId, address]);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleRefresh = () => {
    if (jobId) {
      loadJobDetails(jobId);
    }
  };

  // 复制结果到剪贴板
  const handleCopyResult = async () => {
    if (jobDetails && jobDetails.results[selectedAgentIndex]) {
      const result = parseExecutionResult(
        jobDetails.results[selectedAgentIndex].executionResult
      );
      try {
        await navigator.clipboard.writeText(result.text);
        message.success("Result copied to clipboard");
      } catch (error) {
        message.error("Failed to copy to clipboard");
      }
    }
  };

  // 下载结果
  const handleDownloadResult = () => {
    if (jobDetails && jobDetails.results[selectedAgentIndex]) {
      const result = parseExecutionResult(
        jobDetails.results[selectedAgentIndex].executionResult
      );
      const blob = new Blob([result.text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `job-${jobDetails.job.id}-result.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (loading && !jobDetails) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content className="flex justify-center items-center">
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!jobDetails) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content className="flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Job not found
            </h2>
            <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
          </div>
        </Content>
      </Layout>
    );
  }

  const selectedAgent = jobDetails.results[selectedAgentIndex];
  const statusConfig = getStatusConfig(jobDetails.job.status);
  const selectedResult = parseExecutionResult(
    selectedAgent?.executionResult || ""
  );

  return (
    <Layout className="min-h-screen bg-gray-50 pb-4">
      <Content className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleBackToDashboard}
                className="flex items-center"
              >
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <Badge
                  status={statusConfig.color as any}
                  text={statusConfig.text}
                />
                <Button icon={<ShareAltOutlined />} type="primary">
                  Share Results
                </Button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {jobDetails.job.jobTitle}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>
                📅 Created: {formatDateTime(jobDetails.job.createdAt)}
              </span>
              <span>
                👛 Owner: {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>

            {/* 执行统计 */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <Statistic
                title="Total Agents"
                value={jobDetails.summary.total}
              />
              <Statistic
                title="Completed"
                value={jobDetails.summary.completed}
                valueStyle={{ color: "#52c41a" }}
              />
              <Statistic
                title="Working"
                value={jobDetails.summary.working}
                valueStyle={{ color: "#1890ff" }}
              />
              <Statistic
                title="Failed"
                value={jobDetails.summary.failed}
                valueStyle={{ color: "#ff4d4f" }}
              />
              <Statistic
                title="Assigned"
                value={jobDetails.summary.assigned}
                valueStyle={{ color: "#faad14" }}
              />
            </div>
          </div>

          {/* Agent Results */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Agent Results ({jobDetails.results.length} agents)
                </h2>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Agent 选择器 */}
              <div className="flex gap-4 mb-6 overflow-x-auto">
                {jobDetails.results.map((result, index) => {
                  const agentStatusConfig = getStatusConfig(result.workStatus);
                  return (
                    <div
                      key={result.agent.id}
                      onClick={() => setSelectedAgentIndex(index)}
                      className={`flex-shrink-0 p-4 border rounded-lg cursor-pointer transition-colors ${
                        index === selectedAgentIndex
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {result.agent.agentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {result.agent.agentName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge status={agentStatusConfig.color as any} />
                            <span className="text-xs">
                              {agentStatusConfig.text}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Success: {result.agent.successRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 选中的 Agent 详情 */}
              {selectedAgent && (
                <div className="space-y-6">
                  <Card size="small" title="Agent Details">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Assigned:</span>
                        <div className="font-medium">
                          {formatDateTime(selectedAgent.assignedAt)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <div className="font-medium">
                          {formatExecutionTime(selectedAgent.executionTimeMs)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Progress:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            percent={selectedAgent.progress}
                            size="small"
                            className="flex-1"
                            status={
                              selectedAgent.workStatus === "FAILED"
                                ? "exception"
                                : undefined
                            }
                          />
                          <span className="font-medium">
                            {selectedAgent.progress}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Retries:</span>
                        <div className="font-medium">
                          {selectedAgent.retryCount}
                        </div>
                      </div>
                    </div>

                    {selectedAgent.startedAt && (
                      <div className="mt-4 text-sm">
                        <span className="text-gray-500">Started:</span>
                        <span className="ml-2 font-medium">
                          {formatDateTime(selectedAgent.startedAt)}
                        </span>
                      </div>
                    )}

                    {selectedAgent.completedAt && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Completed:</span>
                        <span className="ml-2 font-medium">
                          {formatDateTime(selectedAgent.completedAt)}
                        </span>
                      </div>
                    )}
                  </Card>

                  {/* 执行结果 */}
                  <Card
                    title="Execution Result"
                    size="small"
                    extra={
                      <div className="flex gap-2">
                        <Button
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={handleCopyResult}
                        >
                          Copy
                        </Button>
                        <Button
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={handleDownloadResult}
                        >
                          Download
                        </Button>
                      </div>
                    }
                  >
                    {selectedAgent.errorMessage ? (
                      <Alert
                        message="Execution Error"
                        description={selectedAgent.errorMessage}
                        type="error"
                        showIcon
                      />
                    ) : (
                      <div>
                        <div className="text-sm text-gray-700 whitespace-pre-line mb-4">
                          {selectedResult.text}
                        </div>

                        {/* Token 使用统计 */}
                        {selectedResult.usage && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Token Usage:
                            </h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Prompt:</span>
                                <span className="ml-2 font-medium">
                                  {selectedResult.usage.promptTokens}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Completion:
                                </span>
                                <span className="ml-2 font-medium">
                                  {selectedResult.usage.completionTokens}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Total:</span>
                                <span className="ml-2 font-medium">
                                  {selectedResult.usage.totalTokens}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 警告信息 */}
                        {selectedResult.warnings &&
                          selectedResult.warnings.length > 0 && (
                            <div className="border-t pt-4">
                              <h4 className="text-sm font-medium text-yellow-700 mb-2">
                                Warnings:
                              </h4>
                              {selectedResult.warnings.map(
                                (warning: string, index: number) => (
                                  <Alert
                                    key={index}
                                    message={warning}
                                    type="warning"
                                    size="small"
                                    className="mb-2"
                                  />
                                )
                              )}
                            </div>
                          )}
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default JobDetailPage;
