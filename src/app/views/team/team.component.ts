import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { TeamMember } from '../../models/task.model';
import { HoverElevateDirective } from '../../directives/hover-elevate.directive';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RouterLink, HoverElevateDirective],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  public teamMembers: TeamMember[] = [];

  constructor(
    private taskService: TaskService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.taskService.getTeamMembers().subscribe(members => {
      this.teamMembers = members;
    });
  }

  public updateStatus(memberId: string, status: 'online' | 'busy' | 'away'): void {
    this.taskService.updateMemberStatus(memberId, status);
    const member = this.teamMembers.find(m => m.id === memberId);
    if (member) {
      this.toastService.show(`${member.name}'s status changed to ${status}`, 'info');
    }
  }
}
