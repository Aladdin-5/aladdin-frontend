// 显示状态类型
export type JobDisplayStatus =
  | "Open"
  | "Distributed"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Expired";

// API状态枚举
export enum JobStatus {
  OPEN = "OPEN",
  DISTRIBUTED = "DISTRIBUTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

// 前端显示用的Job数据结构
export interface JobData {
  id: string;
  title: string;
  description: string;
  category: string;
  status: JobDisplayStatus; // 使用明确的显示状态类型
  priority?: string;
  difficulty?: string;
  budget: string;
  author: string;
  createdAt: string;
  isEscrowProtected?: boolean;
  isFree?: boolean;
  isOpenToBids?: boolean;
  tags?: string[];
  features?: string[];
}

// 优化后的状态转换函数
export const getStatusDisplayName = (
  status: string | JobStatus
): JobDisplayStatus => {
  // 状态映射表
  const statusMap: Record<string, JobDisplayStatus> = {
    // 已转换状态的映射（防止重复转换）
    Open: "Open",
    Distributed: "Distributed",
    "In Progress": "In Progress",
    Completed: "Completed",
    Cancelled: "Cancelled",
    Expired: "Expired",
    // 枚举值映射
    [JobStatus.OPEN]: "Open",
    [JobStatus.DISTRIBUTED]: "Distributed",
    [JobStatus.IN_PROGRESS]: "In Progress",
    [JobStatus.COMPLETED]: "Completed",
    [JobStatus.CANCELLED]: "Cancelled",
    [JobStatus.EXPIRED]: "Expired",
  };

  return statusMap[status] || "Open";
};

// 反向转换：显示状态到API状态
export const getApiStatus = (displayStatus: JobDisplayStatus): JobStatus => {
  const reverseMap: Record<JobDisplayStatus, JobStatus> = {
    Open: JobStatus.OPEN,
    Distributed: JobStatus.DISTRIBUTED,
    "In Progress": JobStatus.IN_PROGRESS,
    Completed: JobStatus.COMPLETED,
    Cancelled: JobStatus.CANCELLED,
    Expired: JobStatus.EXPIRED,
  };

  return reverseMap[displayStatus] || JobStatus.OPEN;
};

// 状态检查工具函数
export const isValidApiStatus = (status: string): status is JobStatus => {
  return Object.values(JobStatus).includes(status as JobStatus);
};

export const isValidDisplayStatus = (
  status: string
): status is JobDisplayStatus => {
  const validStatuses: JobDisplayStatus[] = [
    "Open",
    "Distributed",
    "In Progress",
    "Completed",
    "Cancelled",
    "Expired",
  ];
  return validStatuses.includes(status as JobDisplayStatus);
};

// 预算类型
export interface BudgetRange {
  min: number;
  max: number;
}

// 分页参数
export interface PageParams {
  skip?: number;
  take?: number;
}

// Job API响应
export interface JobResponse {
  id: string;
  jobTitle: string;
  category: string;
  description: string;
  deliverables?: string;
  budget: number | BudgetRange;
  maxBudget?: number;
  deadline: string;
  paymentType: string;
  priority?: string;
  skillLevel?: string;
  tags: string[];
  autoAssign?: boolean;
  allowBidding?: boolean;
  allowParallelExecution?: boolean;
  escrowEnabled?: boolean;
  isPublic?: boolean;
  walletAddress: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

// Job列表响应
export interface JobListResponse {
  jobs?: JobResponse[];
  data?: {
    jobs?: JobResponse[];
    agents?: JobResponse[]; // 临时兼容后端字段错误
  };
  meta?: {
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
  };
}

// 创建Job请求
export interface CreateJobRequest {
  jobTitle: string;
  category: string;
  description: string;
  deliverables?: string;
  budget: number | BudgetRange;
  maxBudget?: number;
  deadline: string;
  paymentType: string;
  priority?: string;
  skillLevel?: string;
  tags: string[];
  autoAssign?: boolean;
  allowBidding?: boolean;
  allowParallelExecution?: boolean;
  escrowEnabled?: boolean;
  isPublic?: boolean;
  walletAddress: string;
}

// 统计数据
export interface JobStats {
  label: string;
  value: number;
  color: "purple" | "green" | "blue" | "gray";
}

// 工具函数：安全的数据提取
export const extractJobsFromResponse = (response: any): JobResponse[] => {
  // 尝试多种可能的数据结构
  if (Array.isArray(response)) {
    return response;
  }

  if (response?.jobs && Array.isArray(response.jobs)) {
    return response.jobs;
  }

  if (response?.data?.jobs && Array.isArray(response.data.jobs)) {
    return response.data.jobs;
  }

  if (response?.data?.agents && Array.isArray(response.data.agents)) {
    return response.data.agents;
  }

  console.warn("Could not extract jobs from response:", response);
  return [];
};
