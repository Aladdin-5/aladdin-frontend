export interface JobData {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Expired';
  priority: 'High' | 'Medium' | 'Low';
  difficulty: string;
  budget: string;
  author: string;
  createdAt: string;
  isEscrowProtected?: boolean;
  isFree?: boolean;
  isOpenToBids?: boolean;
  tags?: string[];
  features?: string[];
}