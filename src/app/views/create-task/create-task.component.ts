import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { TeamMember, TaskCategory, TaskPriority, TaskStatus } from '../../models/task.model';
import { PriorityBadgePipe } from '../../pipes/priority-badge.pipe';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, PriorityBadgePipe],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {
  public taskForm!: FormGroup;
  public teamMembers: TeamMember[] = [];
  public currentTags: string[] = ['Angular', 'Frontend'];
  public newTagInput = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService.getTeamMembers().subscribe(members => {
      this.teamMembers = members;
    });

    this.initForm();
  }

  private initForm(): void {
    // Default due date to 5 days from today in YYYY-MM-DD format
    const defaultDate = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];

    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['Frontend', Validators.required],
      priority: ['Medium', Validators.required],
      status: ['backlog', Validators.required],
      assigneeId: ['usr-1', Validators.required],
      dueDate: [defaultDate, Validators.required],
      estimatedHours: [8, [Validators.required, Validators.min(0.5), Validators.max(200)]],
      isUrgent: [false]
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  public addTag(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const cleanTag = this.newTagInput.trim().replace(/^#/, '');
    if (cleanTag && !this.currentTags.includes(cleanTag)) {
      this.currentTags.push(cleanTag);
      this.newTagInput = '';
    }
  }

  public removeTag(tag: string): void {
    this.currentTags = this.currentTags.filter(t => t !== tag);
  }

  public getSelectedAssignee(): TeamMember | undefined {
    const id = this.taskForm.get('assigneeId')?.value;
    return this.teamMembers.find(m => m.id === id);
  }

  public loadSampleTemplate(): void {
    this.taskForm.patchValue({
      title: 'Integrate Real-Time Web Worker Signal Processing',
      description: 'Offload computationally intensive analytics data crunching to dedicated Web Workers, preventing main thread lag on high-frequency telemetry dashboards.',
      category: 'Frontend',
      priority: 'High',
      status: 'in-progress',
      assigneeId: 'usr-1',
      estimatedHours: 14,
      isUrgent: true
    });
    this.currentTags = ['WebWorkers', 'Signals', 'Performance', 'Telemetry'];
    this.toastService.show('Sample template values loaded into form!', 'info');
  }

  public onReset(): void {
    this.taskForm.reset({
      category: 'Frontend',
      priority: 'Medium',
      status: 'backlog',
      assigneeId: 'usr-1',
      estimatedHours: 8,
      isUrgent: false
    });
    this.currentTags = [];
    this.toastService.show('Form cleared', 'info');
  }

  public onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.toastService.show('Please resolve validation errors before submitting.', 'warning');
      return;
    }

    const formVal = this.taskForm.value;
    const assignee = this.getSelectedAssignee() || this.teamMembers[0];

    this.taskService.addTask({
      title: formVal.title.trim(),
      description: formVal.description.trim(),
      category: formVal.category as TaskCategory,
      priority: formVal.priority as TaskPriority,
      status: formVal.status as TaskStatus,
      assignee: {
        id: assignee.id,
        name: assignee.name,
        email: assignee.email,
        avatar: assignee.avatar,
        role: assignee.role
      },
      dueDate: new Date(formVal.dueDate).toISOString(),
      estimatedHours: Number(formVal.estimatedHours),
      tags: [...this.currentTags],
      isUrgent: !!formVal.isUrgent,
      progressPercentage: formVal.status === 'completed' ? 100 : (formVal.status === 'in-progress' ? 25 : 0)
    });

    this.toastService.show(`Task "${formVal.title}" created successfully!`, 'success');
    this.router.navigate(['/tasks']);
  }
}
