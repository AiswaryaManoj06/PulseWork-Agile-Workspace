export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'backlog' | 'in-progress' | 'in-review' | 'completed';
export type TaskCategory = 'Frontend' | 'Backend' | 'DevOps' | 'UI/UX' | 'QA' | 'Docs';

export interface Assignee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: Assignee;
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
  createdAt: string;
  isUrgent: boolean;
  progressPercentage: number;
}

export interface TeamMember extends Assignee {
  status: 'online' | 'busy' | 'away';
  activeTasksCount: number;
  completedTasksCount: number;
  skills: string[];
}

export interface ActivityLog {
  id: string;
  action: string;
  taskTitle: string;
  user: string;
  timestamp: string;
  type: 'create' | 'update' | 'status-change' | 'delete';
}

export interface DashboardMetrics {
  totalTasks: number;
  backlogTasks: number;
  inProgressTasks: number;
  inReviewTasks: number;
  completedTasks: number;
  urgentTasks: number;
  completionRate: number;
  totalEstimatedHours: number;
  totalTeamMembers: number;
}
