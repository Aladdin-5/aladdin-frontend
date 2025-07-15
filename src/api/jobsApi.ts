import apiClient from "@/config/api";
import {
  CreateJobRequest,
  PageParams,
  JobListResponse,
} from "@/types/jobs/index";

// 这里url先写死方便快速调试，这里需要统一到axios实例baseURL中
const url = "http://111.229.134.131:3999";

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
