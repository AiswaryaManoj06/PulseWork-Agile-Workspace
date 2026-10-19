import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { Task, DashboardMetrics, ActivityLog, TaskStatus } from '../../models/task.model';
import { PriorityBadgePipe } from '../../pipes/priority-badge.pipe';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { HoverElevateDirective } from '../../directives/hover-elevate.directive';
import { PulseStatusDirective } from '../../directives/pulse-status.directive';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';

interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PriorityBadgePipe,
    TimeAgoPipe,
    HoverElevateDirective,
    PulseStatusDirective,
    TaskModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public metrics: DashboardMetrics = {
    totalTasks: 0,
    backlogTasks: 0,
    inProgressTasks: 0,
    inReviewTasks: 0,
    completedTasks: 0,
    urgentTasks: 0,
    completionRate: 0,
    totalEstimatedHours: 0,
    totalTeamMembers: 0
  };

  public upcomingTasks: Task[] = [];
  public activityLogs: ActivityLog[] = [];
  public categoryStats: CategoryStat[] = [];
  public selectedTask: Task | null = null;

  // 264 is the circumference of circle with radius 42 (2 * pi * 42 ≈ 263.89)
  public gaugeDashoffset = 264;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.taskService.getMetrics().subscribe(m => {
      this.metrics = m;
      this.updateGauge(m.completionRate);
    });

    this.taskService.getTasks().subscribe(tasks => {
      this.calculateCategoryStats(tasks);
      this.upcomingTasks = tasks
        .filter(t => t.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 4);
    });

    this.taskService.getActivityLogs().subscribe(logs => {
      this.activityLogs = logs.slice(0, 7);
    });
  }

  private updateGauge(rate: number): void {
    const circumference = 264;
    const progress = Math.min(100, Math.max(0, rate));
    this.gaugeDashoffset = circumference - (circumference * progress) / 100;
  }

  private calculateCategoryStats(tasks: Task[]): void {
    const total = tasks.length || 1;
    const colorMap: Record<string, string> = {
      Frontend: '#6366f1',
      Backend: '#06b6d4',
      DevOps: '#10b981',
      'UI/UX': '#a855f7',
      QA: '#f59e0b',
      Docs: '#64748b'
    };

    const categories = ['Frontend', 'Backend', 'DevOps', 'UI/UX', 'QA', 'Docs'];
    this.categoryStats = categories.map(cat => {
      const count = tasks.filter(t => t.category === cat).length;
      return {
        name: cat,
        count,
        percentage: (count / total) * 100,
        color: colorMap[cat] || '#6366f1'
      };
    }).sort((a, b) => b.count - a.count);
  }

  public openTaskModal(task: Task): void {
    this.selectedTask = { ...task };
  }

  public onStatusChange(event: { id: string; status: TaskStatus }): void {
    this.taskService.updateTaskStatus(event.id, event.status);
    if (this.selectedTask && this.selectedTask.id === event.id) {
      this.selectedTask.status = event.status;
    }
    this.toastService.show(`Task status updated to "${event.status}"!`, 'success');
  }

  public onProgressChange(task: Task): void {
    this.taskService.updateTask(task);
    this.toastService.show(`Task progress updated to ${task.progressPercentage}%!`, 'info');
  }

  public onDeleteTask(id: string): void {
    this.taskService.deleteTask(id);
    this.selectedTask = null;
    this.toastService.show('Task deleted successfully!', 'danger');
  }
}
