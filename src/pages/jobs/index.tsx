import React, { useState } from "react";
import { Layout, Input, Button, Select, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import StatsCard from "./components/StatsCard";
import JobList from "./components/JobList";
import { JobData } from "./types";

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const JobsPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // 模拟数据
  const stats = [
    { label: "Total Tasks", value: 0, color: "purple" },
    { label: "Open", value: 0, color: "green" },
    { label: "In Progress", value: 0, color: "blue" },
    { label: "Completed", value: 0, color: "gray" },
  ];

  const jobs: JobData[] = [
    {
      id: "1",
      title: "测试任务：管理问题处理",
      description:
        "请您配处理一个客户关于知识库内的查看等的问题，业务管理等相关的流程技术支持的自身动意，测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容",
      category: "Marketing Expert",
      status: "Expired",
      priority: "Medium",
      difficulty: "Intermediate",
      budget: "$50 - $200 USDT",
      author: "0x1234...cdef",
      createdAt: "Jun 27, 2025",
      isEscrowProtected: true,
      tags: ["问题处理", "测试"],
      features: ["Auto-assign enabled", "Escrow protected", "Open for bidding"],
    },
    {
      id: "2",
      title: "测试任务标题",
      description:
        "我想设计或我设计的测试输出的逻辑名称，并且有条一些可以输出和打开",
      category: "Visual Designer",
      status: "Open",
      priority: "Low",
      difficulty: "Intermediate",
      budget: "$50 USDT",
      author: "0x3301...tc53",
      createdAt: "Jul 10, 2025",
      isEscrowProtected: true,
      isFree: true,
      isOpenToBids: true,
      tags: ["问题处理", "测试"],
      features: ["Auto-assign enabled", "Escrow protected", "Open for bidding"],
    },
    {
      id: "3",
      title: "测试任务标题",
      description:
        "我想设计或我设计的测试输出的逻辑名称，并且有条一些可以输出和打开",
      category: "Visual Designer",
      status: "Open",
      priority: "Low",
      difficulty: "Intermediate",
      budget: "$50 USDT",
      author: "0x3301...tc53",
      createdAt: "Jul 10, 2025",
      isEscrowProtected: true,
      isFree: true,
      isOpenToBids: true,
      tags: ["问题处理", "测试"],
      features: ["Auto-assign enabled", "Escrow protected", "Open for bidding"],
    },
    {
      id: "4",
      title: "测试任务标题",
      description:
        "我想设计或我设计的测试输出的逻辑名称，并且有条一些可以输出和打开",
      category: "Visual Designer",
      status: "Open",
      priority: "Low",
      difficulty: "Intermediate",
      budget: "$50 USDT",
      author: "0x3301...tc53",
      createdAt: "Jul 10, 2025",
      isEscrowProtected: true,
      isFree: true,
      isOpenToBids: true,
      tags: ["问题处理", "测试"],
      features: ["Auto-assign enabled", "Escrow protected", "Open for bidding"],
    },
  ];

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
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      job.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All Status" || job.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

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
            <h2 className="text-2xl font-bold text-gray-900">Jobs List</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-gray-600">
                Found {filteredJobs.length} tasks
              </span>
              {/* <div className="flex flex-wrap gap-2">
                {categories.slice(1).map((category) => (
                  <Button
                    key={category}
                    type={selectedCategory === category ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setSelectedCategory(category)}
                    className={`text-xs ${
                      selectedCategory === category 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div> */}
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                className="w-32"
                size="small"
              >
                <Option value="All Status">All Status</Option>
                <Option value="Open">Open</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Expired">Expired</Option>
              </Select>
            </div>
          </div>

          <JobList jobs={filteredJobs} />
        </div>
      </Content>
    </Layout>
  );
};

export default JobsPage;
