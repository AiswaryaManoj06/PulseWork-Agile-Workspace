import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task.model';
import { PriorityBadgePipe } from '../../pipes/priority-badge.pipe';
import { PulseStatusDirective } from '../../directives/pulse-status.directive';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityBadgePipe, PulseStatusDirective],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent {
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<{ id: string; status: TaskStatus }>();
  @Output() progressChange = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  public onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  public onUpdateStatus(status: TaskStatus): void {
    if (!this.task) return;
    this.statusChange.emit({ id: this.task.id, status });
  }

  public onProgressChange(): void {
    if (!this.task) return;
    if (this.task.progressPercentage === 100 && this.task.status !== 'completed') {
      this.task.status = 'completed';
    }
    this.progressChange.emit(this.task);
  }

  public onDeleteTask(): void {
    if (!this.task) return;
    if (confirm(`Are you sure you want to delete task "${this.task.title}"?`)) {
      this.delete.emit(this.task.id);
    }
  }
}
