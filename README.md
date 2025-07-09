# TaskFlowPro - Client

A modern task management web application built with Next.js, designed for efficient team collaboration and productivity.

- **Client Link:** https://task-flow-pro-tau.vercel.app/
- **Server Link:** https://taskflowpro-00l4.onrender.com
 **Note:** Load Server Url first when it shows running then go to client url. 

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Scripts](#scripts)

## Features

- 🔐**User Authentication**: Secure login/registration with JWT
- 📋**Task Management**: Full CRUD operations with rich task attributes
- 🔔**Real-Time Notifications**: Instant updates using Socket.io
- 👥**Role-Based Access Control**: Admin, Manager, and User roles
- 📊**Analytics Dashboard**: Visual reports with Chart.js
- 🔍**Advanced Search/Filter**: Combined text search and multiple filters
- 📱**PWA Support**: Offline functionality and installable

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Headless UI
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Real-Time**: Socket.io Client
- **Charts**: Chart.js 4
- **Date Handling**: React Datepicker
- **Testing**: Jest + React Testing Library

## Setup

### Prerequisites
- Node.js v18+
- npm v9+
- Backend server running (see server README)

### Installation
1. Clone repository:
```bash
git clone https://github.com/yourusername/taskflowpro.git
cd taskflowpro/client
```
2. Install dependencies::
```bash
npm install
```
3. Create environment file (.env.local):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:

```bash
npm run build && npm start
```

## Project Structure

```bash
src/
├── components/       # Reusable UI components
│   ├── TaskCard.jsx
│   ├── TaskForm.jsx
│   ├── ProtectedRoute.jsx
│   └── NotificationBadge.jsx
├── context/          # State management
│   └── AuthContext.js
├── pages/            # Application routes
│   ├── dashboard.js
│   ├── admin/users.js
│   ├── index.js
│   ├── login.js
│   ├── register.js
│   ├── analytics.js
│   └── auditLogs.js
├── styles/           # CSS modules
│   └── globals.css
└── utils/            # Helper functions
│   ├── api.js
│   ├── auth.js
│   ├── chartConfig.js
│   ├── PersistLogin.js
│   ├── useRefreshToken.js
│   └── RegisterSW.js
```

## Scripts

```bash
npm run dev: Start development server

npm run build: Create optimized production build

npm start: Start production server

npm run lint: Run ESLint static analysis

npm test: Run Jest test suite
```
## Approach

### Component Architecture
- **Modular Components**: Reusable UI components with prop drilling prevention  
- **Context API**: Global state management for authentication  
- **Custom Hooks**: Encapsulated Socket.io and API logic  

### Real-Time Updates
- **Socket.io** for instant notifications on:  
  - Task assignments  
  - Status updates  
  - Due date changes  

### PWA Implementation
- **Offline-first strategy**  
- Service worker caching for core assets  
- Web App Manifest for native installation  

### Performance
- Dynamic imports for heavy components  
- Client-side navigation with Next.js `Link`  
- Optimized API calls with Axios interceptors  

### UI/UX
- Mobile-responsive layout with Tailwind  
- Form validation with native HTML5  
- Loading states and error boundaries  
- Accessible ARIA labels  

