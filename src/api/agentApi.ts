import apiClient from "@/config/api"
import {ApiParams,ApiConfig,ApiData} from '@/config/apiTypes'
import {AgentFormData} from '@/types/agents/index'
const url='http://localhost:3000'
// nst url = process.env.VUE_APP_API_LOGISTICS

const agentApi= { 
  // 获取所有 Agent
  getAllAgents: () => apiClient.get(url + `/agents`),

  //获取单个 Agent
  getAgentById: (id:string) => {
    return apiClient.get(`/agents/${id}`);
  },

  // 创建 Agent
  addAgent: (agentData:AgentFormData) => {
    return apiClient.post(url+'/agents', agentData);
  },

//   // 更新 Agent
//   updateAgent: (id, agentData) => {
//     return apiClient.patch(`/agents/${id}`, agentData);
//   },

  // 删除 Agent
  deleteAgent: (id:string) => {
    return apiClient.delete(url+`/agents/${id}`);
  }
};

export default agentApi;
export { agentApi };