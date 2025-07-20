import React, { useState } from "react";
import { Layout, Button, Alert, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { PlusOutlined, WalletOutlined } from "@ant-design/icons";
import JobsContainer from "../jobs/components/JobContainer"; // 使用统一的JobsContainer
import { JobData } from "../jobs/types";

const { Content } = Layout;
const { Search } = Input;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected, isLoading } = useAccount();
  const [dashboardSearchTerm, setDashboardSearchTerm] = useState(""); // 添加搜索状态

  const handleJobClick = (job: JobData) => {
    navigate(`/dashboard/jobs/${job.id}`);
  };

  const handleCreateJob = () => {
    navigate("/jobs/create");
  };

  // 加载状态
  if (isLoading) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content className="flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wallet...</p>
          </div>
        </Content>
      </Layout>
    );
  }

  // 未连接钱包状态
  if (!isConnected || !address) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 mb-8">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold mb-3">
                My Tasks Dashboard
              </h1>
              <p className="text-sm sm:text-base mb-6 opacity-90">
                Connect your wallet to view your tasks
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-6">
            <Alert
              message="Wallet Not Connected"
              description="Please connect your wallet using the button in the top right corner to view and manage your tasks."
              type="warning"
              showIcon
              icon={<WalletOutlined />}
              className="text-center"
              action={
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Go to Connect
                </Button>
              }
            />
          </div>
        </Content>
      </Layout>
    );
  }

  // 已连接钱包，显示任务
  return (
    <Layout className="min-h-screen bg-gray-50 pb-4">
      <Content>
        {/* Hero Section - 添加搜索功能 */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 mb-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              My Tasks Dashboard
            </h1>
            <p className="text-sm sm:text-base mb-6 opacity-90">
              Manage and track your posted tasks
            </p>

            {/* 显示当前钱包地址 */}
            <div className="text-sm opacity-75 mb-6">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </div>

            {/* 添加搜索和创建按钮 */}
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Search
                    placeholder="Search my tasks..."
                    size="large"
                    value={dashboardSearchTerm}
                    onChange={(e) => setDashboardSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={handleCreateJob}
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 whitespace-nowrap"
                >
                  Post New Task
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 使用统一的 JobsContainer，传递搜索词 */}
        <JobsContainer
          onJobClick={handleJobClick}
          showCreateButton={false}
          pageTitle="My Jobs"
          statsPrefix="My"
          searchTerm={dashboardSearchTerm} // 传递搜索词给容器组件
        />
      </Content>
    </Layout>
  );
};

export default DashboardPage;
