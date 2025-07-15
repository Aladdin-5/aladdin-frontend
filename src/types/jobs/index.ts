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
  walletAddress: string;
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
