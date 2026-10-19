import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.model';

@Pipe({
  name: 'taskFilter',
  standalone: true,
  pure: false
})
export class TaskFilterPipe implements PipeTransform {
  transform(
    tasks: Task[] | null,
    searchQuery: string = '',
    selectedCategory: string = 'All',
    selectedPriority: string = 'All',
    selectedStatus: string = 'All'
  ): Task[] {
    if (!tasks) return [];

    let filtered = [...tasks];

    // Filter by Search Query
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q)) ||
          t.assignee.name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Filter by Priority
    if (selectedPriority && selectedPriority !== 'All') {
      filtered = filtered.filter(t => t.priority === selectedPriority);
    }

    // Filter by Status
    if (selectedStatus && selectedStatus !== 'All') {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    return filtered;
  }
}
