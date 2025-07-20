export interface CreateJobRequest {
  jobTitle: string;
  category: string;
  description: string;
  deliverables?: string;
  budget: number | { min: number; max: number };
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
  walletAddress: string | undefined;
}

export interface JobResponse {
  id: string;
  jobTitle: string;
  category: string;
  description: string;
  deliverables?: string;
  budget: any;
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
  status:
    | "OPEN"
    | "DISTRIBUTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  jobs?: JobResponse[];
  meta?: {
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
  };
}

export interface PageParams {
  skip?: number;
  take?: number;
}

export interface JobDetailResponse {
  job: {
    id: string;
    jobTitle: string;
    status: "COMPLETED" | "IN_PROGRESS" | "OPEN" | "CANCELLED" | "EXPIRED";
    createdAt: string;
  };
  summary: {
    total: number;
    completed: number;
    failed: number;
    working: number;
    assigned: number;
  };
  results: Array<{
    agent: {
      id: string;
      agentName: string;
      agentAddress: string;
      reputation: number;
      successRate: number;
    };
    workStatus: "COMPLETED" | "IN_PROGRESS" | "FAILED" | "ASSIGNED";
    assignedAt: string;
    startedAt?: string;
    completedAt?: string;
    executionTimeMs: number;
    progress: number;
    retryCount: number;
    executionResult: string;
    errorMessage?: string;
  }>;
}
