# PTI Easy - Fleet Management Dashboard

A modern, professional fleet management web application for streamlining Pre-Trip Inspection (PTI) processes. Built with React, TypeScript, and Tailwind CSS.

![PTI Easy Dashboard](https://via.placeholder.com/1200x600/2563EB/FFFFFF?text=PTI+Easy+Dashboard)

## 🚀 Features

### 🎯 Core Functionality

- **Dashboard Overview**: Real-time fleet statistics and activity monitoring
- **Employee Management**: Complete CRUD operations for drivers and dispatchers
- **Vehicle Management**: Full vehicle fleet management with assignments and tracking
- **PTI Session Management**: Create, assign, and monitor pre-trip inspection sessions
- **Statistics & Analytics**: Comprehensive reporting with charts and performance metrics

### 🎨 User Experience

- **Modern Design**: Professional UI with PTI Easy brand colors
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Real-time Notifications**: Live updates for PTI submissions and issues
- **Interactive Components**: Smooth animations and hover effects
- **Accessibility**: High contrast ratios and keyboard navigation

### 🛠 Technical Features

- **Type Safety**: Full TypeScript implementation
- **Component Library**: Comprehensive UI components with Radix UI
- **State Management**: React Query for server state management
- **Authentication**: Simple login system with role-based access
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton loaders and smooth transitions

## 🎨 Design System

### Color Palette

- **Primary Blue**: `#2563EB` - Trust and professionalism
- **Success Green**: `#10B981` - Completed inspections and success states
- **Warning Orange**: `#F59E0B` - Pending items and attention needed
- **Error Red**: `#EF4444` - Issues and critical alerts
- **Neutral Gray**: `#6B7280` - Text and secondary elements

### Typography

- **Font Family**: Inter (sans-serif)
- **Headings**: 24-32px (bold)
- **Body Text**: 16px (regular)
- **Small Text**: 14px (tables and metadata)

## 🏗 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx          # Main application layout with sidebar
│   ├── shared/
│   │   ├── StatsCard.tsx          # Reusable dashboard statistics cards
│   │   ├── ActivityFeed.tsx       # Real-time activity feed component
│   │   ├── QuickActions.tsx       # Dashboard quick action buttons
│   │   ├── NotificationSystem.tsx # Real-time notification bell
│   │   ├── Loading.tsx            # Loading states and skeleton loaders
│   │   └── ErrorBoundary.tsx      # Error handling and boundaries
│   └── ui/                        # Shadcn/ui component library
├── pages/
│   ├── Login.tsx                  # Authentication page
│   ├── Dashboard.tsx              # Main dashboard with overview
│   ├── Employees.tsx              # Employee management (fully functional)
│   ├── Vehicles.tsx               # Vehicle management (placeholder)
│   ├── PTISessions.tsx            # PTI session management (placeholder)
│   ├── Statistics.tsx             # Analytics and reporting (placeholder)
│   └── NotFound.tsx               # 404 error page
├── lib/
│   └── utils.ts                   # Utility functions and helpers
└── App.tsx                        # Main application with routing
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pti-easy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Login

Use any email and password combination to access the dashboard. The application includes mock authentication for demonstration purposes.

## 📱 Usage Guide

### 🔐 Authentication

1. Access the login page at `/login`
2. Enter any email and password (demo mode)
3. Click "Sign In" to access the dashboard

### 📊 Dashboard

- **Overview Cards**: View fleet statistics at a glance
- **Activity Feed**: Monitor recent PTI submissions and issues
- **Quick Actions**: Access common tasks with one click
- **Compliance Rate**: Track inspection completion rates

### 👥 Employee Management

- **View Employees**: Browse all drivers and dispatchers
- **Add Employee**: Create new user accounts with role assignment
- **Edit Details**: Update employee information and vehicle assignments
- **Search & Filter**: Find employees quickly with search functionality

### 🔔 Notifications

- **Real-time Updates**: Receive live notifications for PTI submissions
- **Priority Levels**: Color-coded alerts based on urgency
- **Interactive**: Click notifications to navigate to relevant pages
- **Mark as Read**: Manage notification status

## 🛠 Technology Stack

### Frontend

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing and navigation

### UI Components

- **Radix UI**: Accessible, unstyled UI primitives
- **Shadcn/ui**: Beautiful component library built on Radix
- **Lucide React**: Consistent icon system
- **Class Variance Authority**: Component variant management

### State & Data

- **React Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Runtime type validation
- **Date-fns**: Date formatting and manipulation

### Development Tools

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Vitest**: Fast unit testing framework

## 🎯 Roadmap

### Phase 1: Foundation ✅

- [x] Project setup and design system
- [x] Authentication and routing
- [x] Dashboard with real-time updates
- [x] Employee management (full CRUD)
- [x] Notification system

### Phase 2: Core Features ✅

- [x] Vehicle management with full functionality
- [x] PTI session creation and assignment
- [x] Comprehensive statistics dashboard with charts
- [x] Issue tracking and performance analytics
- [x] Real-time compliance monitoring

### Phase 3: Advanced Features (Future)

- [ ] Mobile-responsive PTI checklist interface for drivers
- [ ] Photo upload and issue reporting with camera integration
- [ ] Email notifications and alerts
- [ ] API integration for real backend
- [ ] Mobile app for drivers (React Native)
- [ ] Advanced predictive analytics

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run unit tests
- `npm run format.fix` - Format code with Prettier

### Component Development

New components should follow these patterns:

- Use TypeScript interfaces for props
- Include proper accessibility attributes
- Follow the established design system
- Include loading and error states
- Use the `cn` utility for conditional classes

### API Integration

The application currently uses mock data. To integrate with a real backend:

1. Update API calls in component files
2. Configure React Query for proper caching
3. Add proper error handling for network failures
4. Implement proper authentication tokens

## 📄 License

This project is part of a fleet management solution designed for logistic companies. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions about implementation or customization:

- Check the component documentation in the source code
- Review the design system guidelines above
- Open an issue for bugs or feature requests

---

**PTI Easy** - Making fleet management simple, safe, and efficient. 🚛✅
