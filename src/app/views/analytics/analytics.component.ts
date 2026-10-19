import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { DashboardMetrics, TeamMember, Task } from '../../models/task.model';
import { HoverElevateDirective } from '../../directives/hover-elevate.directive';

interface CategoryHours {
  category: string;
  taskCount: number;
  hours: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, HoverElevateDirective],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
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

  public teamMembers: TeamMember[] = [];
  public categoryBreakdown: CategoryHours[] = [];
  public estimatedBudget = 0;
  public averageHoursPerTask = 0;
  public sprintEndDate = new Date(Date.now() + 86400000 * 7);

  constructor(
    private taskService: TaskService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.taskService.getMetrics().subscribe(m => {
      this.metrics = m;
      this.estimatedBudget = m.totalEstimatedHours * 95;
      this.averageHoursPerTask = m.totalTasks > 0 ? m.totalEstimatedHours / m.totalTasks : 0;
    });

    this.taskService.getTeamMembers().subscribe(members => {
      this.teamMembers = members;
    });

    this.taskService.getTasks().subscribe(tasks => {
      this.computeCategoryBreakdown(tasks);
    });
  }

  private computeCategoryBreakdown(tasks: Task[]): void {
    const map = new Map<string, { count: number; hours: number }>();

    for (const t of tasks) {
      const current = map.get(t.category) || { count: 0, hours: 0 };
      map.set(t.category, {
        count: current.count + 1,
        hours: current.hours + (t.estimatedHours || 0)
      });
    }

    this.categoryBreakdown = Array.from(map.entries()).map(([cat, data]) => ({
      category: cat,
      taskCount: data.count,
      hours: data.hours
    })).sort((a, b) => b.hours - a.hours);
  }

  public exportReport(): void {
    this.toastService.show('Performance telemetry report downloaded!', 'success');
  }
}
