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
  