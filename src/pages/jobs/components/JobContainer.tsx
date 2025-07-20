import React, { useState, useEffect } from "react";
import { Input, Button, Select, message, Spin } from "antd";
import { useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { ReloadOutlined } from "@ant-design/icons";
import StatsCard from "./StatsCard";
import JobList from "./JobList";
import { JobData, JobStatus, JobResponse } from "../types";
import jobsApi from "@/api/jobsApi";

const { Option } = Select;

interface JobsContainerProps {
  onJobClick?: (job: JobData) => void; // 点击任务的回调
  showCreateButton?: boolean; // 是否显示创建按钮
  pageTitle?: string; // 页面标题
  statsPrefix?: string; // 统计前缀，如 "My" 或 ""
  searchTerm?: string; // 外部传入的搜索词
}

type JobDisplayStatus =
  | "Open"
  | "Distributed"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Expired";

const JobsContainer: React.FC<JobsContainerProps> = ({
  onJobClick,
  showCreateButton = true,
  pageTitle = "Jobs List",
  statsPrefix = "",
  searchTerm = "", // 接收外部搜索词
}) => {
  const location = useLocation(); // 获取当前路由
  const { address } = useAccount(); // 获取钱包地址

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([
    { label: `${statsPrefix} Total Tasks`.trim(), value: 0, color: "purple" },
    { label: "Open", value: 0, color: "green" },
    { label: "In Progress", value: 0, color: "blue" },
    { label: "Completed", value: 0, color: "gray" },
  ]);

  // 判断是否为 Dashboard 页面
  const isDashboard = location.pathname.startsWith("/dashboard");

  const categories = [
    "All Categories",
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

  const statusOptions = [
    "All Status",
    "OPEN",
    "DISTRIBUTED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "EXPIRED",
  ];

  const getStatusDisplayName = (
    status: string | JobStatus
  ): JobDisplayStatus => {
    const statusMap: Record<string, JobDisplayStatus> = {
      OPEN: "Open",
      DISTRIBUTED: "Distributed",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      EXPIRED: "Expired",
      Open: "Open",
      Distributed: "Distributed",
      "In Progress": "In Progress",
      Completed: "Completed",
      Cancelled: "Cancelled",
      Expired: "Expired",
    };
    return statusMap[status] || "Open";
  };

  const formatBudget = (budget: any): string => {
    if (typeof budget === "number") {
      return `$${budget} USDT`;
    }
    if (
      typeof budget === "object" &&
      budget?.min !== undefined &&
      budget?.max !== undefined
    ) {
      return `$${budget.min} - $${budget.max} USDT`;
    }
    return "$0 USDT";
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const generateFeatures = (apiJob: JobResponse): string[] => {
    const features: string[] = [];
    if (apiJob.autoAssign) features.push("Auto-assign enabled");
    if (apiJob.escrowEnabled) features.push("Escrow protected");
    if (apiJob.allowBidding) features.push("Open for bidding");
    if (apiJob.allowParallelExecution) features.push("Parallel execution");
    return features;
  };

  const convertApiJobToJobData = (apiJob: JobResponse): JobData => {
    return {
      id: apiJob.id,
      title: apiJob.jobTitle,
      description: apiJob.description,
      category: apiJob.category,
      status: getStatusDisplayName(apiJob.status),
      priority: apiJob.priority || "Medium",
      difficulty: apiJob.skillLevel || "Intermediate",
      budget: formatBudget(apiJob.budget),
      author: apiJob.walletAddress,
      createdAt: formatDate(apiJob.createdAt),
      isEscrowProtected: apiJob.escrowEnabled,
      isFree: apiJob.paymentType === "Free Jobs",
      isOpenToBids: apiJob.allowBidding,
      tags: apiJob.tags || [],
      features: generateFeatures(apiJob),
    };
  };

  // 智能加载函数：根据路由选择不同的接口
  const loadJobs = async () => {
    try {
      const params = {
        take: 100,
        skip: 0,
      };

      setLoading(true);
      let response;

      if (isDashboard && address) {
        // Dashboard 页面：使用钱包地址查询接口
        console.log("Loading dashboard jobs for wallet:", address);
        response = await jobsApi.getJobsByWallet(address, params);
      } else {
        // Jobs 页面：使用通用查询接口
        console.log("Loading all jobs");
        response = await jobsApi.getJobs(params);
      }

      // 这里需要后端改下字段，这里应该是 jobs字段而不是agents
      const jobs = response?.data?.agents || response?.data?.jobs || [];

      if (Array.isArray(jobs)) {
        const convertedJobs = jobs.map(convertApiJobToJobData);
        setJobs(convertedJobs);
        updateStats(jobs);
      } else {
        console.warn("Received invalid jobs data:", response);
        setJobs([]);
        updateStats([]);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      const errorMessage = isDashboard
        ? "Failed to load my jobs"
        : "Failed to load jobs";
      message.error(errorMessage);
      setJobs([]);
      updateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (jobsData: JobResponse[]) => {
    if (!Array.isArray(jobsData)) {
      return;
    }

    const statusCounts = jobsData.reduce((acc, job) => {
      const status = job.status || "OPEN";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats([
      {
        label: `${statsPrefix} Total Tasks`.trim(),
        value: jobsData.length,
        color: "purple",
      },
      { label: "Open", value: statusCounts["OPEN"] || 0, color: "green" },
      {
        label: "In Progress",
        value:
          (statusCounts["IN_PROGRESS"] || 0) +
          (statusCounts["DISTRIBUTED"] || 0),
        color: "blue",
      },
      {
        label: "Completed",
        value: statusCounts["COMPLETED"] || 0,
        color: "gray",
      },
    ]);
  };

  // 当路由或钱包地址变化时重新加载
  useEffect(() => {
    // 如果是 Dashboard 页面但没有钱包地址，不加载数据
    if (isDashboard && !address) {
      console.log("Dashboard page but no wallet address, skipping load");
      return;
    }

    loadJobs();
  }, [isDashboard, address]); // 依赖路由和钱包地址

  // 使用外部传入的搜索词进行过滤
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm || // 如果没有搜索词，显示所有
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All Categories" ||
      job.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All Status" ||
      job.status.toUpperCase().replace(" ", "_") === selectedStatus ||
      getStatusDisplayName(selectedStatus) === job.status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRefresh = () => {
    loadJobs();
  };

  // 如果是 Dashboard 页面但没有钱包连接，显示提示
  if (isDashboard && !address) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👛</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Wallet Required
          </h3>
          <p className="text-gray-600">
            Please connect your wallet to view your tasks
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              className="flex items-center"
            >
              Refresh
            </Button>
            {/* 调试信息 - 生产环境可以删除 */}
            {process.env.NODE_ENV === "development" && (
              <span className="text-xs text-gray-500">
                Mode: {isDashboard ? "Dashboard" : "All Jobs"}
                {isDashboard &&
                  address &&
                  ` | Wallet: ${address.slice(0, 6)}...`}
                {searchTerm && ` | Search: "${searchTerm}"`}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-gray-600">
              Found {filteredJobs.length} tasks
              {searchTerm && ` for "${searchTerm}"`}
            </span>

            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                className="w-40"
                size="small"
              >
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>

              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                className="w-32"
                size="small"
              >
                {statusOptions.map((status) => (
                  <Option key={status} value={status}>
                    {status === "All Status"
                      ? status
                      : getStatusDisplayName(status)}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* 移除了这里的搜索框 */}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <JobList
            jobs={filteredJobs}
            loading={loading}
            onJobClick={onJobClick}
          />
        )}
      </div>
    </div>
  );
};

export default JobsContainer;
