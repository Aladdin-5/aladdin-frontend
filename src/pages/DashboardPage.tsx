import React from "react";
import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import JobsContainer from "./components/JobsContainer";
import { JobData } from "./types";

const { Content } = Layout;

// 模拟当前钱包地址（实际项目中应该从 wallet context 或 props 中获取）
const CURRENT_WALLET_ADDRESS = "0x3301...1c53";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleJobClick = (job: JobData) => {
    // 跳转到 dashboard 任务详情页面
    navigate(`/dashboard/jobs/${job.id}`);
  };

  const handleCreateJob = () => {
    navigate("/jobs/create");
  };

  return (
    <Layout className="min-h-screen bg-gray-50 pb-4">
      <Content>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 mb-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              My Tasks Dashboard
            </h1>
            <p className="text-sm sm:text-base mb-6 opacity-90">
              Manage and track your posted tasks
            </p>

            <div className="flex justify-center">
              <Button
                onClick={handleCreateJob}
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600"
              >
                Post New Task
              </Button>
            </div>
          </div>
        </div>

        {/* 使用 JobsContainer 组件，传入钱包地址过滤 */}
        <JobsContainer
          walletFilter={CURRENT_WALLET_ADDRESS}
          onJobClick={handleJobClick}
          showCreateButton={false}
          pageTitle="My Jobs"
          statsPrefix="My"
        />
      </Content>
    </Layout>
  );
};

export default DashboardPage;
