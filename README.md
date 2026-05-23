# 🏢 Smart Building Admin Dashboard

**[🚀 Live Demo](https://smart-building-dashboard-aa.netlify.app/)**

A modern Smart Building Administration Dashboard built with **Angular 21**, **Angular Material**, and **TypeScript**. This project demonstrates proficiency in component-based architecture, responsive design, data visualization, and asynchronous API handling.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **5 Interactive Widgets** | Organization Overview, Product Updates, Asset Health, Building Map, Device Analytics |
| 🎨 **Modern UI** | Angular Material components with custom SCSS styling |
| 📱 **Fully Responsive** | Adapts across desktop, tablet, and mobile |
| ⏳ **Simulated API** | Mock JSON data fetched via `fetch()` with configurable latency |
| 💀 **Loading States** | Skeleton loaders on every widget |
| ⚠️ **Error Handling** | Simulated API failures with retry fallback UI |
| ♿ **Accessible** | ARIA labels, semantic HTML, keyboard navigation |

---

## 🛠️ Tech Stack

- **Framework:** Angular 21 (Standalone Components)
- **Language:** TypeScript 5.9 (Strict Mode)
- **UI Library:** Angular Material
- **Styling:** SCSS
- **State Management:** Angular Signals
- **Charts:** Chart.js
- **Maps:** Leaflet + OpenStreetMap
- **Data:** Local JSON files via native `fetch()` API

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20.x
- npm ≥ 10.x
- Angular CLI ≥ 21.x

### Installation

```bash
git clone https://github.com/<your-username>/smart-building-dashboard.git
cd smart-building-dashboard
npm install
ng serve
```

Navigate to **http://localhost:4200/**

---

## 📁 Project Structure

```
smart-building-dashboard/
├── public/data/              # Mock JSON API files
│   ├── overview.json
│   ├── updates.json
│   ├── assets.json
│   ├── map.json
│   └── analytics.json
├── src/app/
│   ├── components/           # 5 widget components
│   ├── services/             # Dashboard service with latency/error simulation
│   ├── app.ts                # Root component
│   ├── app.html              # Shell layout
│   └── app.scss              # Global styles
├── angular.json
└── tsconfig.json
```

---

## 📊 Widgets

| Widget | Description |
|---|---|
| **Organization Overview** | KPI stat cards with animated health gauge |
| **Product Updates** | Vertical timeline with version badges |
| **Asset Health** | Expandable accordions per building/floor |
| **Building Map** | Interactive Leaflet map with custom markers |
| **Device Analytics** | Stacked area chart with trend indicators |

---

## 🏆 Bonus Features

- **Strict TypeScript** — `strict: true` enabled
- **Angular Signals** — Built-in reactive state management
- **Skeleton Loaders** — Custom shimmer animations
- **Error States** — Graceful fallbacks with retry buttons
- **Smooth Animations** — CSS transitions, Chart.js animations
- **Accessibility** — ARIA labels, keyboard navigation

---

## 🌐 Deployment

Deployed on **Netlify**: [https://smart-building-dashboard-aa.netlify.app/](https://smart-building-dashboard-aa.netlify.app/)

---

## 📸 Screenshots & Demo

> **[View Screenshots and Demo Video](https://drive.google.com/drive/folders/1dZXtUsIUDx31oWvTqrEld6DpRwZYI33n?usp=sharing)**

| View | Description |
|---|---|
| **Portfolio Overview** | KPI cards with health gauge |
| **Building Map** | Interactive Leaflet markers |
| **Asset Registry** | Expandable building accordions |
| **Device Analytics** | Stacked area chart |
| **Product Updates** | Animated timeline feed |
| **Error State** | API failure with retry |
| **Loading State** | Skeleton loaders |

---

*Built with Angular 21 + TypeScript + Angular Material*
