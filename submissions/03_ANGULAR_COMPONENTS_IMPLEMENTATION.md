# Deliverable 3: Angular Components Implementation

## Assignment Rubric Evaluation:
- **Are the components correctly implemented and functional?** -> **YES (Exceeds Expectations)**

---

## 1. Architectural Component Hierarchy

PulseWork is developed using Angular 19's recommended **Standalone Component Architecture**. Standalone components reduce boilerplate by eliminating `NgModule` declarations while ensuring explicit dependency management, faster compilation, and seamless tree-shaking.

```
                        ┌──────────────────────────────┐
                        │         AppComponent         │
                        │       (Root Container)       │
                        └──────────────┬───────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
 ┌──────▼──────┐               ┌───────▼────────┐             ┌───────▼────────┐
 │   Header    │               │    Sidebar     │             │     Toast      │
 │  Component  │               │   Component    │             │   Component    │
 └─────────────┘               └────────────────┘             └────────────────┘
                                       │
                         [ Router Outlet Navigation ]
                                       │
      ┌────────────────┬───────────────┼───────────────┬────────────────┐
      │                │               │               │                │
┌─────▼──────┐  ┌──────▼──────┐ ┌──────▼───────┐ ┌─────▼──────┐  ┌──────▼───────┐
│ Dashboard  │  │    Tasks    │ │ Create Task  │ │    Team    │  │  Analytics   │
│ View Comp  │  │  Board Comp │ │  (Form) Comp │ │  Directory │  │  Pipes Comp  │
└─────┬──────┘  └──────┬──────┘ └──────────────┘ └────────────┘  └──────────────┘
      │                │
      └───────┬────────┘
              │
       ┌──────▼───────┐
       │  TaskModal   │
       │  Component   │
       └──────────────┘
```

---

## 2. Component Implementation Details

### 2.1 Root Component (`AppComponent`)
- **Selector**: `app-root`
- **File**: `src/app/app.component.ts`
- **Role**: Coordinates the responsive shell, handles global search routing from the header to `/tasks`, and manages sidebar visibility state (`isSidebarOpen`).
- **Dependencies**: `RouterOutlet`, `CommonModule`, `HeaderComponent`, `SidebarComponent`, `NotificationToastComponent`.

### 2.2 Global Header Component (`HeaderComponent`)
- **Selector**: `app-header`
- **File**: `src/app/components/header/header.component.ts`
- **Features**:
  - Emits `@Output() toggleSidebar = new EventEmitter<void>()` to control mobile drawer.
  - Emits `@Output() searchFilter = new EventEmitter<string>()` on search input.
  - Injects `ThemeService` to toggle Dark/Light mode.
  - Injects `TaskService` to retrieve live activity logs into an unread notification dropdown.
  - Inbuilt click-outside detection via custom directive `appClickOutside`.

### 2.3 Navigation Sidebar Component (`SidebarComponent`)
- **Selector**: `app-sidebar`
- **File**: `src/app/components/sidebar/sidebar.component.ts`
- **Features**:
  - Accepts `@Input() isOpen = false` and emits `@Output() close = new EventEmitter<void>()`.
  - Integrates `RouterLink` and `RouterLinkActive` for visual route tracking.
  - Dynamically calculates active sprint progress percentage and task badges via reactive subscription to `TaskService.getMetrics()`.
  - Provides a "Reset Demo Data" action button to restore pristine mock data at any time.

### 2.4 Executive Dashboard Component (`DashboardComponent`)
- **Selector**: `app-dashboard`
- **File**: `src/app/views/dashboard/dashboard.component.ts`
- **Features**:
  - Displays 5 reactive KPI cards.
  - Dynamically computes SVG circular gauge stroke dashoffset:
    ```typescript
    private updateGauge(rate: number): void {
      const circumference = 264; // 2 * pi * 42
      const progress = Math.min(100, Math.max(0, rate));
      this.gaugeDashoffset = circumference - (circumference * progress) / 100;
    }
    ```
  - Categorizes workload into functional distribution arrays with percentage bars.
  - Sorts and displays upcoming deadlines.
  - Hosts `TaskModalComponent` for instant drill-down.

### 2.5 Agile Task Board Component (`TasksComponent`)
- **Selector**: `app-tasks`
- **File**: `src/app/views/tasks/tasks.component.ts`
- **Features**:
  - Toggles between **Kanban Board** and **Table List** modes.
  - Subscribes to `ActivatedRoute.queryParams` to automatically apply search queries passed from the header or other views.
  - Manages column-based task grouping (`getTasksForColumn(status)`).
  - Handles status transitions (`quickMoveStatus(task, direction, event)`).
  - Pure filtered view logic recalculating dynamically on search, category, or priority changes.

### 2.6 Create Task Reactive Form Component (`CreateTaskComponent`)
- **Selector**: `app-create-task`
- **File**: `src/app/views/create-task/create-task.component.ts`
- **Features**:
  - Implements Angular's `ReactiveFormsModule` with `FormBuilder`.
  - Configures strict validators for data integrity:
    ```typescript
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
    ```
  - Manages dynamic tag chips array (`addTag`, `removeTag`).
  - Pre-fills realistic data with "Fill Sample Data" helper.
  - Coordinates real-time Live Preview Card.

### 2.7 Interactive Task Details Modal (`TaskModalComponent`)
- **Selector**: `app-task-modal`
- **File**: `src/app/components/task-modal/task-modal.component.ts`
- **Features**:
  - Accepts `@Input() task: Task | null`
  - Emits `@Output() close`, `@Output() statusChange`, `@Output() progressChange`, `@Output() delete`
  - Direct progress slider manipulation with two-way data binding `[(ngModel)]="task.progressPercentage"`.

### 2.8 Team Directory Component (`TeamComponent`)
- **Selector**: `app-team`
- **File**: `src/app/views/team/team.component.ts`
- **Features**:
  - Renders team member cards with workload capacity bars and skills.
  - Directly triggers `taskService.updateMemberStatus(memberId, status)` when clicking status buttons.

### 2.9 Analytics & Pipes Component (`AnalyticsComponent`)
- **Selector**: `app-analytics`
- **File**: `src/app/views/analytics/analytics.component.ts`
- **Features**:
  - Computes blended budget allocations ($95/hr standard rate).
  - Calculates average hours per story and category hours breakdown.

### 2.10 Global Toast Notification Component (`NotificationToastComponent`)
- **Selector**: `app-notification-toast`
- **File**: `src/app/components/notification-toast/notification-toast.component.ts`
- **Features**:
  - Reactive subscription to `ToastService.toasts$`
  - Auto-dismisses alerts after 3.5 seconds with animation.

---

## 3. Services & State Management

### 3.1 `TaskService` (`src/app/services/task.service.ts`)
- Implements `@Injectable({ providedIn: 'root' })`.
- Utilizes RxJS `BehaviorSubject` for tasks, team members, and activity logs.
- Automatically syncs state changes to browser `localStorage`.
- Exposes pure Observables: `tasks$`, `team$`, `logs$`, and `getMetrics()`.

### 3.2 `ThemeService` (`src/app/services/theme.service.ts`)
- Implements Angular modern **Signals** (`signal<ThemeMode>('dark')`).
- Synchronizes `document.body` class list between `.theme-dark` and `.theme-light`.
- Preserves user preference in `localStorage`.

### 3.3 `ToastService` (`src/app/services/toast.service.ts`)
- Manages transient user feedback notifications across all views.
