import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task, TeamMember, ActivityLog, DashboardMetrics, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'pulsework_tasks_v1';
  private readonly TEAM_STORAGE_KEY = 'pulsework_team_v1';
  private readonly LOGS_STORAGE_KEY = 'pulsework_logs_v1';

  private initialTeam: TeamMember[] = [
    {
      id: 'usr-1',
      name: 'Sarah Connor',
      email: 'sarah.c@pulsework.io',
      role: 'Lead Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      activeTasksCount: 3,
      completedTasksCount: 14,
      skills: ['Angular', 'TypeScript', 'RxJS', 'SCSS']
    },
    {
      id: 'usr-2',
      name: 'David Kim',
      email: 'david.k@pulsework.io',
      role: 'Senior Backend Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'busy',
      activeTasksCount: 2,
      completedTasksCount: 21,
      skills: ['Node.js', 'PostgreSQL', 'Docker', 'GraphQL']
    },
    {
      id: 'usr-3',
      name: 'Elena Rostova',
      email: 'elena.r@pulsework.io',
      role: 'Staff UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      activeTasksCount: 2,
      completedTasksCount: 18,
      skills: ['Figma', 'Design Systems', 'Micro-interactions', 'Accessibility']
    },
    {
      id: 'usr-4',
      name: 'Marcus Vance',
      email: 'marcus.v@pulsework.io',
      role: 'Cloud & DevOps Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'away',
      activeTasksCount: 1,
      completedTasksCount: 12,
      skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD']
    },
    {
      id: 'usr-5',
      name: 'Aisha Patel',
      email: 'aisha.p@pulsework.io',
      role: 'Quality Assurance Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      activeTasksCount: 2,
      completedTasksCount: 27,
      skills: ['Cypress', 'Playwright', 'Jasmine', 'API Testing']
    }
  ];

  private initialTasks: Task[] = [
    {
      id: 'TSK-101',
      title: 'Architect Angular 19 Standalone Component Tree',
      description: 'Refactor root layout to support lazy routing, standalone components, reactive forms, and CSS custom properties token system.',
      category: 'Frontend',
      priority: 'Critical',
      status: 'in-progress',
      assignee: {
        id: 'usr-1',
        name: 'Sarah Connor',
        email: 'sarah.c@pulsework.io',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'Lead Frontend Architect'
      },
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      estimatedHours: 18,
      actualHours: 12,
      tags: ['Angular', 'Architecture', 'Standalone'],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      isUrgent: true,
      progressPercentage: 65
    },
    {
      id: 'TSK-102',
      title: 'Design Dark & Light Glassmorphic Theme System',
      description: 'Create curated HSL color ramps, backdrop blur tokens, micro-elevation shadows, and contrast compliant accessible palettes.',
      category: 'UI/UX',
      priority: 'High',
      status: 'completed',
      assignee: {
        id: 'usr-3',
        name: 'Elena Rostova',
        email: 'elena.r@pulsework.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Staff UI/UX Designer'
      },
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      estimatedHours: 12,
      actualHours: 11,
      tags: ['Design System', 'Glassmorphism', 'Tokens'],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      isUrgent: false,
      progressPercentage: 100
    },
    {
      id: 'TSK-103',
      title: 'Implement Reactive Form with Dynamic Validation',
      description: 'Build enterprise task creation modal with FormBuilder, custom validators, real-time dirty/touched checks, and tag chips editor.',
      category: 'Frontend',
      priority: 'High',
      status: 'in-progress',
      assignee: {
        id: 'usr-1',
        name: 'Sarah Connor',
        email: 'sarah.c@pulsework.io',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'Lead Frontend Architect'
      },
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      estimatedHours: 14,
      actualHours: 8,
      tags: ['ReactiveForms', 'Validation', 'Pipes'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      isUrgent: false,
      progressPercentage: 55
    },
    {
      id: 'TSK-104',
      title: 'Automate GitHub Actions CI/CD with Docker Matrix',
      description: 'Configure automated build matrix, multi-stage Docker caching, linter assertions, and automated artifact deployment.',
      category: 'DevOps',
      priority: 'Medium',
      status: 'in-review',
      assignee: {
        id: 'usr-4',
        name: 'Marcus Vance',
        email: 'marcus.v@pulsework.io',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        role: 'Cloud & DevOps Lead'
      },
      dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      estimatedHours: 16,
      actualHours: 15,
      tags: ['Docker', 'CI/CD', 'GitHub'],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      isUrgent: false,
      progressPercentage: 90
    },
    {
      id: 'TSK-105',
      title: 'Build Resilient WebSocket Event Streaming Pipeline',
      description: 'Develop reactive stream connection handler with auto-reconnection backoff, message deduplication, and state reconciliation.',
      category: 'Backend',
      priority: 'Critical',
      status: 'backlog',
      assignee: {
        id: 'usr-2',
        name: 'David Kim',
        email: 'david.k@pulsework.io',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'Senior Backend Engineer'
      },
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      estimatedHours: 24,
      tags: ['WebSockets', 'RxJS', 'NodeJS'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isUrgent: true,
      progressPercentage: 0
    },
    {
      id: 'TSK-106',
      title: 'Cross-Device Responsiveness & Touch Gestures QA',
      description: 'Execute automated responsive test suites across iPhone, iPad Pro, Android tablets, and ultra-wide desktop monitors.',
      category: 'QA',
      priority: 'High',
      status: 'in-review',
      assignee: {
        id: 'usr-5',
        name: 'Aisha Patel',
        email: 'aisha.p@pulsework.io',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'Quality Assurance Lead'
      },
      dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
      estimatedHours: 10,
      actualHours: 8,
      tags: ['Responsive', 'Testing', 'Mobile'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      isUrgent: false,
      progressPercentage: 80
    },
    {
      id: 'TSK-107',
      title: 'Document Component Architecture & Directive APIs',
      description: 'Write comprehensive technical documentation, interactive diagrams, and live examples for data bindings and structural directives.',
      category: 'Docs',
      priority: 'Low',
      status: 'backlog',
      assignee: {
        id: 'usr-3',
        name: 'Elena Rostova',
        email: 'elena.r@pulsework.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Staff UI/UX Designer'
      },
      dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      estimatedHours: 8,
      tags: ['Documentation', 'Markdown', 'API'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isUrgent: false,
      progressPercentage: 15
    },
    {
      id: 'TSK-108',
      title: 'PostgreSQL Database Indexing & Query Tuning',
      description: 'Optimize high-frequency task retrieval queries, introduce composite indexes on status/priority, and reduce p99 latency below 35ms.',
      category: 'Backend',
      priority: 'Medium',
      status: 'completed',
      assignee: {
        id: 'usr-2',
        name: 'David Kim',
        email: 'david.k@pulsework.io',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'Senior Backend Engineer'
      },
      dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      estimatedHours: 16,
      actualHours: 14,
      tags: ['PostgreSQL', 'Performance', 'DB'],
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      isUrgent: false,
      progressPercentage: 100
    }
  ];

  private initialLogs: ActivityLog[] = [
    {
      id: 'log-1',
      action: 'completed task',
      taskTitle: 'PostgreSQL Database Indexing & Query Tuning',
      user: 'David Kim',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      type: 'status-change'
    },
    {
      id: 'log-2',
      action: 'moved to review',
      taskTitle: 'Automate GitHub Actions CI/CD with Docker Matrix',
      user: 'Marcus Vance',
      timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
      type: 'status-change'
    },
    {
      id: 'log-3',
      action: 'created task',
      taskTitle: 'Build Resilient WebSocket Event Streaming Pipeline',
      user: 'Sarah Connor',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      type: 'create'
    },
    {
      id: 'log-4',
      action: 'completed task',
      taskTitle: 'Design Dark & Light Glassmorphic Theme System',
      user: 'Elena Rostova',
      timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
      type: 'status-change'
    }
  ];

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private teamSubject = new BehaviorSubject<TeamMember[]>([]);
  private logsSubject = new BehaviorSubject<ActivityLog[]>([]);

  public tasks$ = this.tasksSubject.asObservable();
  public team$ = this.teamSubject.asObservable();
  public logs$ = this.logsSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTasks = localStorage.getItem(this.STORAGE_KEY);
      const savedTeam = localStorage.getItem(this.TEAM_STORAGE_KEY);
      const savedLogs = localStorage.getItem(this.LOGS_STORAGE_KEY);

      const tasks = savedTasks ? JSON.parse(savedTasks) : this.initialTasks;
      const team = savedTeam ? JSON.parse(savedTeam) : this.initialTeam;
      const logs = savedLogs ? JSON.parse(savedLogs) : this.initialLogs;

      this.tasksSubject.next(tasks);
      this.teamSubject.next(team);
      this.logsSubject.next(logs);
    } else {
      this.tasksSubject.next(this.initialTasks);
      this.teamSubject.next(this.initialTeam);
      this.logsSubject.next(this.initialLogs);
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasksSubject.value));
      localStorage.setItem(this.TEAM_STORAGE_KEY, JSON.stringify(this.teamSubject.value));
      localStorage.setItem(this.LOGS_STORAGE_KEY, JSON.stringify(this.logsSubject.value));
    }
  }

  public getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  public getTaskById(id: string): Task | undefined {
    return this.tasksSubject.value.find(t => t.id === id);
  }

  public addTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString()
    };

    const updated = [newTask, ...this.tasksSubject.value];
    this.tasksSubject.next(updated);

    this.logActivity({
      id: `log-${Date.now()}`,
      action: 'created task',
      taskTitle: newTask.title,
      user: newTask.assignee.name,
      timestamp: new Date().toISOString(),
      type: 'create'
    });

    this.updateMemberTaskCount(newTask.assignee.id, 1);
    this.saveToStorage();
    return newTask;
  }

  public updateTask(updatedTask: Task): void {
    const current = this.tasksSubject.value;
    const index = current.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      const nextTasks = [...current];
      nextTasks[index] = updatedTask;
      this.tasksSubject.next(nextTasks);

      this.logActivity({
        id: `log-${Date.now()}`,
        action: 'updated task details',
        taskTitle: updatedTask.title,
        user: updatedTask.assignee.name,
        timestamp: new Date().toISOString(),
        type: 'update'
      });

      this.saveToStorage();
    }
  }

  public updateTaskStatus(id: string, status: TaskStatus): void {
    const current = this.tasksSubject.value;
    const task = current.find(t => t.id === id);
    if (!task) return;

    const oldStatus = task.status;
    let progress = task.progressPercentage;
    if (status === 'completed') progress = 100;
    else if (status === 'in-progress' && progress === 0) progress = 25;
    else if (status === 'in-review' && progress < 80) progress = 85;

    const updatedTask: Task = {
      ...task,
      status,
      progressPercentage: progress
    };

    const nextTasks = current.map(t => (t.id === id ? updatedTask : t));
    this.tasksSubject.next(nextTasks);

    this.logActivity({
      id: `log-${Date.now()}`,
      action: `moved from ${oldStatus} to ${status}`,
      taskTitle: task.title,
      user: task.assignee.name,
      timestamp: new Date().toISOString(),
      type: 'status-change'
    });

    this.saveToStorage();
  }

  public deleteTask(id: string): void {
    const current = this.tasksSubject.value;
    const taskToDelete = current.find(t => t.id === id);
    if (!taskToDelete) return;

    const filtered = current.filter(t => t.id !== id);
    this.tasksSubject.next(filtered);

    this.logActivity({
      id: `log-${Date.now()}`,
      action: 'deleted task',
      taskTitle: taskToDelete.title,
      user: 'Administrator',
      timestamp: new Date().toISOString(),
      type: 'delete'
    });

    this.updateMemberTaskCount(taskToDelete.assignee.id, -1);
    this.saveToStorage();
  }

  public getTeamMembers(): Observable<TeamMember[]> {
    return this.team$;
  }

  public updateMemberStatus(id: string, status: 'online' | 'busy' | 'away'): void {
    const updated = this.teamSubject.value.map(m => {
      if (m.id === id) {
        return { ...m, status };
      }
      return m;
    });
    this.teamSubject.next(updated);
    this.saveToStorage();
  }

  private updateMemberTaskCount(memberId: string, delta: number): void {
    const updated = this.teamSubject.value.map(m => {
      if (m.id === memberId) {
        return { ...m, activeTasksCount: Math.max(0, m.activeTasksCount + delta) };
      }
      return m;
    });
    this.teamSubject.next(updated);
  }

  public getActivityLogs(): Observable<ActivityLog[]> {
    return this.logs$;
  }

  private logActivity(log: ActivityLog): void {
    const current = [log, ...this.logsSubject.value.slice(0, 24)];
    this.logsSubject.next(current);
  }

  public getMetrics(): Observable<DashboardMetrics> {
    return this.tasks$.pipe(
      map(tasks => {
        const total = tasks.length;
        const backlog = tasks.filter(t => t.status === 'backlog').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const inReview = tasks.filter(t => t.status === 'in-review').length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const urgent = tasks.filter(t => t.isUrgent && t.status !== 'completed').length;
        const rate = total > 0 ? (completed / total) * 100 : 0;
        const hours = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

        return {
          totalTasks: total,
          backlogTasks: backlog,
          inProgressTasks: inProgress,
          inReviewTasks: inReview,
          completedTasks: completed,
          urgentTasks: urgent,
          completionRate: rate,
          totalEstimatedHours: hours,
          totalTeamMembers: this.teamSubject.value.length
        };
      })
    );
  }

  public resetSampleData(): void {
    this.tasksSubject.next(this.initialTasks);
    this.teamSubject.next(this.initialTeam);
    this.logsSubject.next(this.initialLogs);
    this.saveToStorage();
  }
}
