# ⚡ PulseWork — Responsive Agile Task & Team Workspace Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/Framework-Angular%2019-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 19" />
  <img src="https://img.shields.io/badge/Language-TypeScript%205.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/State-RxJS%207.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS" />
  <img src="https://img.shields.io/badge/Styling-Vanilla%20CSS3%20Tokens-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Architecture-Standalone%20Components-4f46e5?style=for-the-badge" alt="Standalone" />
</p>

---

## 📖 Overview
**PulseWork** is a responsive single-page web application engineered with **Angular 19**. It provides software teams with an intuitive, dynamic workspace to organize sprint backlogs, track task progress through an interactive Kanban board and list view, inspect team availability, analyze velocity metrics, and create new work items with strict reactive form validation.

---

## 🛠️ Technology Stack & Architecture

| Category | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **Angular 19 (v19.2.27)** | Standalone Components, Signals, Control Flow (`@if`, `@for`, `@switch`), Router |
| **Programming Language** | **TypeScript 5.7+** | Strict typing, interface modeling, modular architecture |
| **Reactive State** | **RxJS 7.8** | `BehaviorSubject`, `Observable`, reactive telemetry streams, and `localStorage` syncing |
| **Form Management** | **Angular Reactive Forms** | `FormBuilder`, `FormGroup`, custom validator rules (`required`, `minLength`, `min`, `max`), dynamic tag chips |
| **Data Binding** | **Angular Data Binding** | Interpolation `{{ }}`, Property Binding `[ ]`, Event Binding `( )`, Two-Way Binding `[(ngModel)]` |
| **Directives** | **Custom & Built-in Directives** | `appHoverElevate`, `appPulseStatus`, `appClickOutside`, `[ngClass]`, `[ngStyle]`, `@if`, `@for`, `@switch` |
| **Pipes** | **Custom & Built-in Pipes** | `TimeAgoPipe`, `PriorityBadgePipe`, `CurrencyPipe`, `PercentPipe`, `DecimalPipe`, `DatePipe`, `UpperCasePipe`, `SlicePipe` |
| **Styling & Design System** | **Vanilla CSS3 Tokens** | Custom HSL color ramps, Glassmorphism (`backdrop-filter: blur`), dark/light theme switching, CSS Grid & Flexbox |

---

## 🌟 Key Application Features

1. **Executive Telemetry Dashboard (`/dashboard`)**:
   - Real-time KPI summary cards (Total Tasks, In Execution, Pending Review, Completed, Critical Blocker items).
   - Animated SVG circular sprint velocity gauge.
   - Functional domain category workload progress distribution bars.
   - Upcoming milestone deadlines and live activity stream.

2. **Agile Task Board (`/tasks`)**:
   - **Kanban Board**: 4 sprint lanes (Backlog, In Progress, In Review, Completed) with single-click status progression (`←` / `→`).
   - **Table List View**: High-density sortable table.
   - Multi-dimensional filter bar (Search text query, Category dropdown, Priority dropdown, Reset button).

3. **Reactive Work Item Creation (`/create-task`)**:
   - Built with Angular `ReactiveFormsModule` and `FormBuilder`.
   - Real-time **Live Card Preview** that updates synchronously as user enters task information.
   - Dynamic tag chips builder with interactive removal.
   - Form state validation styling (`.is-invalid`) and disabled submit button (`[disabled]="taskForm.invalid"`).

4. **Interactive Task Details Modal**:
   - Backdrop blur modal dialog with interactive progress slider (`[(ngModel)]`).
   - Workflow phase transition buttons and task deletion trigger.

5. **Engineering Team Directory (`/team`)**:
   - Resource workload capacity meters and skills tags.
   - Interactive availability status toggle buttons (`🟢 Online`, `🟡 Busy`, `🟣 Away`) with instant state reactivity.

6. **Performance & Resource Analytics (`/analytics`)**:
   - Demonstrates Angular pipes: `CurrencyPipe` ($95/hr rate calculation), `PercentPipe` (velocity ratio), `DecimalPipe` (average story hours), `DatePipe` (sprint deadlines), and `UpperCasePipe`.

---

## 📱 Multi-Device Responsive Design

The application is built mobile-first and adapts across:
- **Desktop (> 1100px)**: Sticky sidebar, 4-column Kanban board, side-by-side reactive form with live preview.
- **Tablet (768px – 1100px)**: 2x2 wrapping Kanban grid, auto-fit KPI cards, off-canvas navigation drawer.
- **Mobile (< 768px)**: Header with hamburger menu (`☰`), slide-out navigation drawer with backdrop blur overlay, single-column scrollable task feed, and touch-friendly controls.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ or v24+)
- npm (v10+)

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/AiswaryaManoj06/PulseWork-Agile-Workspace.git
cd PulseWork-Agile-Workspace

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# or
ng serve --port 4200
```

Navigate to `http://localhost:4200/` in your browser.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── components/            # Reusable standalone components
│   │   ├── header/            # Navbar, theme toggle, notifications
│   │   ├── sidebar/           # Navigation links, sprint counters
│   │   ├── task-modal/        # Task inspection dialog
│   │   └── notification-toast/# Floating feedback alerts
│   ├── directives/            # Custom Angular directives
│   │   ├── click-outside.directive.ts
│   │   ├── hover-elevate.directive.ts
│   │   └── pulse-status.directive.ts
│   ├── models/                # TypeScript interfaces (Task, TeamMember, Metrics)
│   ├── pipes/                 # Custom Angular pipes
│   │   ├── priority-badge.pipe.ts
│   │   ├── task-filter.pipe.ts
│   │   └── time-ago.pipe.ts
│   ├── services/              # Reactive singleton services
│   │   ├── task.service.ts    # RxJS BehaviorSubject task management
│   │   ├── theme.service.ts   # Dark/light mode signal state
│   │   └── toast.service.ts   # Transient toast notifications
│   └── views/                 # Routed page views
│       ├── analytics/         # Pipes & performance telemetry
│       ├── create-task/       # Reactive Form with live preview
│       ├── dashboard/         # KPI metrics & circular SVG gauge
│       ├── tasks/             # Kanban board & list table
│       └── team/              # Team member directory & status toggles
├── styles.css                 # Design token system & CSS variables
└── index.html                 # Root document with Google Fonts & SEO tags
```

---

## 📄 License
This project is open-source under the MIT License.
