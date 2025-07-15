import React, { useState, useEffect } from "react";
import { Layout, Input, Button, Select, Badge, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import StatsCard from "./components/StatsCard";
import JobList from "./components/JobList";
import { JobData, JobStatus, JobResponse } from "./types";
import jobsApi from "@/api/jobsApi";

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

// 定义显示状态类型
type JobDisplayStatus =
  | "Open"
  | "Distributed"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Expired";

const JobsPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([
    { label: "Total Tasks", value: 0, color: "purple" },
    { label: "Open", value: 0, color: "green" },
    { label: "In Progress", value: 0, color: "blue" },
    { label: "Completed", value: 0, color: "gray" },
  ]);

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

  // 修复后的状态显示名称转换函数
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
      // 支持已转换的状态
      Open: "Open",
      Distributed: "Distributed",
      "In Progress": "In Progress",
      Completed: "Completed",
      Cancelled: "Cancelled",
      Expired: "Expired",
    };
    return statusMap[status] || "Open";
  };

  // 预算格式化函数
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

  // 日期格式化函数
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

  // 生成特性标签
  const generateFeatures = (apiJob: JobResponse): string[] => {
    const features: string[] = [];
    if (apiJob.autoAssign) features.push("Auto-assign enabled");
    if (apiJob.escrowEnabled) features.push("Escrow protected");
    if (apiJob.allowBidding) features.push("Open for bidding");
    if (apiJob.allowParallelExecution) features.push("Parallel execution");
    return features;
  };

  // API响应转换为前端显示数据
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

  // 加载Jobs数据
  const loadJobs = async () => {
    try {
      const params = {
        take: 100,
        skip: 0,
      };
      setLoading(true);
      const response = await jobsApi.getJobs(params);

      // 这里需要后端改下字段，这里应该是 jobs字段而不是agents
      const jobs = response?.data?.agents || [];

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
      message.error("Failed to load jobs");
      setJobs([]);
      updateStats([]);
    } finally {
      setLoading(false);
    }
  };

  // 更新统计数据
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
      { label: "Total Tasks", value: jobsData.length, color: "purple" },
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

  useEffect(() => {
    loadJobs();
  }, []);

  // 筛选Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
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

  return (
    <Layout className="min-h-screen bg-gray-50 pb-4">
      <Content className="px-4 sm:px-6 lg:px-8"></Content>

      {/* Hero Section - 全屏背景 */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 mb-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Aladdin Protocol Task Collaboration Hub
          </h1>
          <p className="text-sm sm:text-base mb-6 opacity-90">
            Post tasks and let AI Agents complete them efficiently
          </p>

          {/* Search and Filters */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Search
                  placeholder="Search task titles, descriptions, or tags"
                  size="large"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={() => navigate("/jobs/create")}
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 whitespace-nowrap"
              >
                Post Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Content className="px-4 sm:px-6 lg:px-8">
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
              <h2 className="text-2xl font-bold text-gray-900">Jobs List</h2>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
                className="flex items-center"
              >
                Refresh
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-gray-600">
                Found {filteredJobs.length} tasks
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

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
            </div>
          ) : (
            <JobList jobs={filteredJobs} />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default JobsPage;
