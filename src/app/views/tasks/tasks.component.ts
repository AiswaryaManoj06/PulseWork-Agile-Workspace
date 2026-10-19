import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { Task, TaskStatus } from '../../models/task.model';
import { PriorityBadgePipe } from '../../pipes/priority-badge.pipe';
import { HoverElevateDirective } from '../../directives/hover-elevate.directive';
import { PulseStatusDirective } from '../../directives/pulse-status.directive';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';

interface KanbanColumn {
  title: string;
  status: TaskStatus;
  color: string;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PriorityBadgePipe,
    HoverElevateDirective,
    PulseStatusDirective,
    TaskModalComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  public allTasks: Task[] = [];
  public viewMode: 'kanban' | 'list' = 'kanban';

  // Filters with two-way binding
  public searchQuery = '';
  public selectedCategory = 'All';
  public selectedPriority = 'All';
  public selectedStatus = 'All';

  public selectedTask: Task | null = null;

  public columns: KanbanColumn[] = [
    { title: 'Backlog', status: 'backlog', color: '#64748b' },
    { title: 'In Progress', status: 'in-progress', color: '#3b82f6' },
    { title: 'In Review', status: 'in-review', color: '#f59e0b' },
    { title: 'Completed', status: 'completed', color: '#10b981' }
  ];

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.allTasks = tasks;
    });

    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
      }
    });
  }

  public setViewMode(mode: 'kanban' | 'list'): void {
    this.viewMode = mode;
  }

  public get filteredTasks(): Task[] {
    return this.allTasks.filter(task => {
      // Query filter
      if (this.searchQuery && this.searchQuery.trim().length > 0) {
        const q = this.searchQuery.toLowerCase().trim();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description.toLowerCase().includes(q);
        const matchTag = task.tags.some(tag => tag.toLowerCase().includes(q));
        const matchUser = task.assignee.name.toLowerCase().includes(q);
        const matchId = task.id.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTag && !matchUser && !matchId) {
          return false;
        }
      }

      // Category filter
      if (this.selectedCategory !== 'All' && task.category !== this.selectedCategory) {
        return false;
      }

      // Priority filter
      if (this.selectedPriority !== 'All' && task.priority !== this.selectedPriority) {
        return false;
      }

      // Status filter
      if (this.selectedStatus !== 'All' && task.status !== this.selectedStatus) {
        return false;
      }

      return true;
    });
  }

  public getTasksForColumn(status: TaskStatus): Task[] {
    return this.filteredTasks.filter(t => t.status === status);
  }

  public resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.selectedPriority = 'All';
    this.selectedStatus = 'All';
  }

  public openModal(task: Task): void {
    this.selectedTask = { ...task };
  }

  public quickMoveStatus(task: Task, direction: 'prev' | 'next', event: MouseEvent): void {
    event.stopPropagation();
    const statusOrder: TaskStatus[] = ['backlog', 'in-progress', 'in-review', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);

    if (direction === 'next' && currentIndex < statusOrder.length - 1) {
      const nextStatus = statusOrder[currentIndex + 1];
      this.taskService.updateTaskStatus(task.id, nextStatus);
      this.toastService.show(`Moved "${task.title}" to ${nextStatus}`, 'success');
    } else if (direction === 'prev' && currentIndex > 0) {
      const prevStatus = statusOrder[currentIndex - 1];
      this.taskService.updateTaskStatus(task.id, prevStatus);
      this.toastService.show(`Moved "${task.title}" to ${prevStatus}`, 'info');
    }
  }

  public onModalStatusChange(event: { id: string; status: TaskStatus }): void {
    this.taskService.updateTaskStatus(event.id, event.status);
    if (this.selectedTask && this.selectedTask.id === event.id) {
      this.selectedTask.status = event.status;
    }
    this.toastService.show(`Task status updated to "${event.status}"!`, 'success');
  }

  public onModalProgressChange(task: Task): void {
    this.taskService.updateTask(task);
    this.toastService.show(`Progress updated!`, 'info');
  }

  public onModalDelete(id: string): void {
    this.taskService.deleteTask(id);
    this.selectedTask = null;
    this.toastService.show('Task deleted!', 'danger');
  }
}
