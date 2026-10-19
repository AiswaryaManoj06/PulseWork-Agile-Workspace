# PulseWork — Agile Task & Team Workspace Management Platform

## 1. Project Title
**PulseWork — Responsive Agile Task & Team Workspace Management Platform**

---

## 2. Executive Summary
**PulseWork** is an enterprise-grade, responsive single-page web application engineered with **Angular 19** using modern standalone component architecture. It provides software engineering teams and product managers with an intuitive, dynamic workspace to organize sprint backlogs, track task progress through an interactive Kanban board and list view, inspect team availability, analyze velocity analytics, and create new work items with strict reactive form validation.

---

## 3. Core Capabilities
- **Executive Telemetry Dashboard**: Real-time KPI summary cards (Total Tasks, In Execution, Pending Review, Completed, Critical Blocker items), dynamic SVG circular sprint velocity gauge, functional category distribution, upcoming milestone deadlines, and live activity timeline.
- **Dual-View Task Board**:
  - **Kanban Board**: 4 sprint lanes (Backlog, In Progress, In Review, Completed) with interactive single-click status progression, elevation effects, and priority pulse indicators.
  - **Table List View**: High-density tabular layout with sortable attributes, assignee tags, and direct inspection triggers.
- **Enterprise Reactive Form**:
  - Built with Angular `ReactiveFormsModule`, `FormBuilder`, and comprehensive `Validators` (`required`, `minLength`, `maxLength`, `min`, `max`).
  - Dynamic interactive tag chips creator.
  - Side-by-side **Live Card Preview** that updates in real time as the engineer types into form controls.
  - Instant validation feedback, visual error alerts (`.is-invalid`), and submission button locking (`[disabled]="taskForm.invalid"`).
- **Engineering Team Directory**:
  - Staff workload capacity meters and active/resolved story metrics.
  - Interactive status toggle buttons (`Online`, `Busy`, `Away`) with instant UI reactivity.
- **Analytics & Angular Pipes Showcase**:
  - Deep demonstrations of built-in Angular pipes: `CurrencyPipe` ($95/hr rate calculations), `PercentPipe` (velocity ratios), `DecimalPipe` (average hours per task), `DatePipe` (localized sprint deadlines), `UpperCasePipe` (domain identifiers), and `SlicePipe`.
  - Custom pipes: `TimeAgoPipe` and `PriorityBadgePipe`.
- **Responsive Architecture**:
  - CSS Custom Properties (Theme tokens) supporting one-click **Dark & Light Mode** toggling.
  - Fully adaptive layouts supporting mobile devices (<768px) with off-canvas hamburger navigation drawer, tablet layouts (768px-1199px), and desktop ultra-wide monitors (1200px+).

---

## 4. Tech Stack & Environment
- **Framework**: Angular 19 (Standalone Components, Signals, Reactive State)
- **Language**: TypeScript 5.7+
- **Styling**: Vanilla CSS3 Design System with CSS Variables, Flexbox, and CSS Grid
- **State Management**: Reactive RxJS `BehaviorSubject` with LocalStorage fallback
- **Form Architecture**: Angular Reactive Forms (`FormBuilder`, `FormGroup`, `FormControl`, `Validators`)
- **Dev Server**: `npm run dev` / `ng serve --port 4200`
