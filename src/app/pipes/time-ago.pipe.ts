import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const diffInSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

    // If future date
    if (diffInSeconds < 0) {
      const futureSeconds = Math.abs(diffInSeconds);
      if (futureSeconds < 60) return 'in a few seconds';
      const minutes = Math.round(futureSeconds / 60);
      if (minutes < 60) return `in ${minutes}m`;
      const hours = Math.round(minutes / 60);
      if (hours < 24) return `in ${hours}h`;
      const days = Math.round(hours / 24);
      return `in ${days}d`;
    }

    if (diffInSeconds < 30) {
      return 'just now';
    }

    const minutes = Math.round(diffInSeconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.round(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.round(hours / 24);
    if (days === 1) {
      return 'yesterday';
    }
    if (days < 30) {
      return `${days}d ago`;
    }

    const months = Math.round(days / 30);
    if (months < 12) {
      return `${months}mo ago`;
    }

    const years = Math.round(months / 12);
    return `${years}y ago`;
  }
}
