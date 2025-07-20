import React, { useState } from "react";
import { Layout, Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import JobContainer from "./components/JobContainer";
import { JobData } from "./types";

const { Content } = Layout;
const { Search } = Input;

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearchTerm, setHeroSearchTerm] = useState(""); // Hero区域的搜索状态

  const handleJobClick = (job: JobData) => {
    // 跳转到任务详情页面（可以是独立的任务详情页，不是dashboard的）
    // navigate(`/jobs/${job.id}`);
    console.log("Job clicked in Jobs page:", job);
  };

  const handleCreateJob = () => {
    navigate("/jobs/create");
  };

  return (
    <Layout className="min-h-screen bg-gray-50 pb-4">
      <Content>
        {/* Hero Section - 搜索功能在这里 */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 mb-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              Aladdin Protocol Task Collaboration Hub
            </h1>
            <p className="text-sm sm:text-base mb-6 opacity-90">
              Post tasks and let AI Agents complete them efficiently
            </p>

            {/* 搜索和创建按钮 */}
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Search
                    placeholder="Search task titles, descriptions, or tags"
                    size="large"
                    value={heroSearchTerm}
                    onChange={(e) => setHeroSearchTerm(e.target.value)}
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
                  Post Task
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 使用 JobContainer 组件，传递搜索词 */}
        <JobContainer
          onJobClick={handleJobClick}
          showCreateButton={false}
          pageTitle="Jobs List"
          statsPrefix=""
          searchTerm={heroSearchTerm} // 传递搜索词
        />
      </Content>
    </Layout>
  );
};

export default JobsPage;
