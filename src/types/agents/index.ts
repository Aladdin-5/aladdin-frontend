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

export  interface AgentDetailModalProps {
    agent: Agent | null;
    onClose: () => void;
  }
 // 定义表单数据类型
 export interface FormData {
    agentName: string;
    tags: string[];
    autoAcceptJobs: boolean;
    agentClassification: string;
    agentAddress: string;
    briefDescription: string;
    authorBio: string;
    isFree: boolean;
  } 