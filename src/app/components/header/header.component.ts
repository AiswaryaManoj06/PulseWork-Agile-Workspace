import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { TaskService } from '../../services/task.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { ActivityLog } from '../../models/task.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective, TimeAgoPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() searchFilter = new EventEmitter<string>();

  public searchQuery = '';
  public showNotifications = false;
  public unreadCount = 3;
  public activityLogs: ActivityLog[] = [];

  public currentUser = {
    name: 'Sarah Connor',
    role: 'Lead Architect',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  };

  constructor(
    private themeService: ThemeService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskService.getActivityLogs().subscribe(logs => {
      this.activityLogs = logs.slice(0, 5);
    });
  }

  public isDark(): boolean {
    return this.themeService.isDark();
  }

  public onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  public toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.unreadCount = 0;
    }
  }

  public closeNotifications(): void {
    this.showNotifications = false;
  }

  public markAllAsRead(): void {
    this.unreadCount = 0;
    this.showNotifications = false;
  }

  public onSearchChange(): void {
    this.searchFilter.emit(this.searchQuery);
  }
}
