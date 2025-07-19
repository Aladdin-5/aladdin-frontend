export interface Agent {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
  features: string[];
  avatar: string;
  isFree: boolean;
}

export interface AgentDetailModalProps {
  agent: AgentFormData | null;
  onClose: () => void;
}
// 定义表单数据类型
export interface AgentFormData {
  id?:string;
  agentName: string;//Agent名称
  agentAddress: string;//Agent地址（API端点
  description: string;//Agent描述
  authorBio: string;//作者简介
  agentClassification: string;//Agent分类
  tags: string[];//标签列表
  isPrivate?: boolean;//是否私有
  autoAcceptJobs: boolean;//是否自动接受任务
  contractType?: string;//合约类型
  isActive?: boolean;//是否激活
  walletAddress: string;//钱包地址
  isFree?: boolean;//是否免费
  pricePerCall?:string //次数多少钱
} 