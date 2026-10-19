import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    NotificationToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public title = 'PulseWork';
  public isSidebarOpen = false;

  constructor(private router: Router) {}

  public onGlobalSearch(query: string): void {
    if (query && query.trim().length > 0) {
      this.router.navigate(['/tasks'], {
        queryParams: { q: query.trim() },
        queryParamsHandling: 'merge'
      });
    }
  }
}
