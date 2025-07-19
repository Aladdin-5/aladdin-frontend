import apiClient from "@/config/api";
import {
  CreateJobRequest,
  PageParams,
  JobListResponse,
} from "@/types/jobs/index";

// 这里url先写死方便快速调试，这里需要统一到axios实例baseURL中
const url='https://qvn0otpzd9.execute-api.us-west-1.amazonaws.com/dev'

const jobsApi = {
  // jobs列表
  getJobs: async (params: PageParams) =>
    apiClient.get(url + `/jobs/page`, { params }),

  // 创建 job
  createJob: (data: CreateJobRequest) => {
    return apiClient.post(url + "/jobs", data);
  },
};

export default jobsApi;
export { jobsApi };
