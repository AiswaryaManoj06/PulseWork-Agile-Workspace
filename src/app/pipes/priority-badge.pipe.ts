import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../models/task.model';

@Pipe({
  name: 'priorityBadge',
  standalone: true
})
export class PriorityBadgePipe implements PipeTransform {
  transform(priority: TaskPriority | string): string {
    switch (priority) {
      case 'Critical':
        return 'badge-critical';
      case 'High':
        return 'badge-high';
      case 'Medium':
        return 'badge-medium';
      case 'Low':
        return 'badge-low';
      default:
        return 'badge-medium';
    }
  }
}
