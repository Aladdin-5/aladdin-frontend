import React from "react";
import { Card, Tag, Avatar } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { JobData } from "../types";

interface JobCardProps {
  job: JobData;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      Open: "green",
      "In Progress": "blue",
      Completed: "gray",
      Expired: "orange",
    };
    return colors[status as keyof typeof colors] || "default";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      High: "red",
      Medium: "orange",
      Low: "blue",
    };
    return colors[priority as keyof typeof colors] || "default";
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 border-gray-200 relative h-72"
      bodyStyle={{
        padding: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Right top tags */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
        <Tag color="red" className="text-xs font-medium px-2 py-0">
          🚨 Urgent
        </Tag>
        <Tag color="purple" className="text-xs font-medium px-2 py-0">
          ⭐ 2.1K+
        </Tag>
      </div>

      {/* Header with Avatar and Title */}
      <div className="flex items-start gap-3 mb-3 pr-16">
        <Avatar
          size={36}
          className="bg-blue-500 flex-shrink-0 text-sm font-bold"
        >
          {job.id}
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1 leading-tight">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{job.author}</span>
            <span>•</span>
            <span className="text-blue-500">{job.category}</span>
          </div>
        </div>
      </div>

      {/* Status and Meta tags */}
      <div className="flex items-center gap-2 mb-3">
        <Tag
          color={getStatusColor(job.status)}
          icon={job.status === "Expired" ? "⏰" : undefined}
          className="text-xs px-2 py-0"
        >
          {job.status}
        </Tag>
        <Tag
          color={getPriorityColor(job.priority)}
          className="text-xs px-2 py-0"
        >
          {job.priority}
        </Tag>
        <span className="text-xs text-gray-500">{job.difficulty}</span>
        <div className="flex items-center text-xs text-gray-500 ml-auto">
          <ClockCircleOutlined className="mr-1" />
          {job.createdAt}
        </div>
      </div>

      {/* Description - 固定2行高度 */}
      <div className="mb-3">
        <p
          className="text-sm text-gray-700 leading-5 line-clamp-2"
          style={{ minHeight: "40px" }}
        >
          {job.description}
        </p>
      </div>

      {/* Tags - 固定高度 */}
      <div className="mb-3" style={{ minHeight: "24px" }}>
        {job.tags &&
          job.tags.slice(0, 3).map((tag, index) => (
            <Tag
              key={index}
              className="mb-1 mr-1 text-xs bg-gray-100 border-gray-300 px-2 py-0"
            >
              {tag}
            </Tag>
          ))}
      </div>

      {/* Features - 固定高度 */}
      <div className="mb-3" style={{ minHeight: "28px" }}>
        {job.features &&
          job.features.slice(0, 2).map((feature, index) => (
            <div
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded mr-2"
            >
              • {feature}
            </div>
          ))}
      </div>

      {/* Spacer - 自动填充剩余空间 */}
      <div className="flex-1"></div>

      {/* Footer - 固定在底部 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{job.budget}</span>
          {job.isEscrowProtected && (
            <Tag color="blue" size="small" className="text-xs px-1">
              💰 ESCROW
            </Tag>
          )}
        </div>
        <div className="text-xs text-gray-500">Created {job.createdAt}</div>
      </div>
    </Card>
  );
};

export default JobCard;
