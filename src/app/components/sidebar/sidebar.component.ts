import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  public totalTasks = 0;
  public completedTasks = 0;
  public totalTeam = 0;
  public completionRate = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getMetrics().subscribe(metrics => {
      this.totalTasks = metrics.totalTasks;
      this.completedTasks = metrics.completedTasks;
      this.totalTeam = metrics.totalTeamMembers;
      this.completionRate = metrics.completionRate;
    });
  }

  public onNavClick(): void {
    this.close.emit();
  }

  public resetData(): void {
    if (confirm('Reset sample tasks to default demo dataset?')) {
      this.taskService.resetSampleData();
    }
  }
}
