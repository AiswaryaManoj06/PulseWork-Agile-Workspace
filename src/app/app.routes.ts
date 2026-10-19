import { Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { TasksComponent } from './views/tasks/tasks.component';
import { CreateTaskComponent } from './views/create-task/create-task.component';
import { TeamComponent } from './views/team/team.component';
import { AnalyticsComponent } from './views/analytics/analytics.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'PulseWork | Executive Dashboard' },
  { path: 'tasks', component: TasksComponent, title: 'PulseWork | Task & Story Board' },
  { path: 'create-task', component: CreateTaskComponent, title: 'PulseWork | Create Work Item' },
  { path: 'team', component: TeamComponent, title: 'PulseWork | Team Directory' },
  { path: 'analytics', component: AnalyticsComponent, title: 'PulseWork | Analytics & Pipes' },
  { path: '**', redirectTo: 'dashboard' }
];
