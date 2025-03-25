# Task Management System with Real-time Notifications

A modern task management system built with microservices architecture, featuring real-time notifications and drag-n-drop task management.

## Project Structure

```
TaskManagment/
├── frontend/               # React TypeScript frontend with Vite
├── api-gateway/           # API Gateway service
├── user-service/         # User authentication and management
├── task-service/        # Task and project management
└── notification-service/ # Real-time notifications
```

## Tech Stack

### Frontend
- React (TypeScript) with Vite
- ShadCN UI
- React Query
- React Hook Form + Yup
- Socket.io-client
- DND Kit for drag-n-drop

### Backend
- NestJS microservices
- MongoDB (User & Notification services)
- PostgreSQL (Task service)
- JWT Authentication
- Socket.io for real-time features

## Setup Instructions

1. Install dependencies for each service:
```bash
# Frontend
cd frontend
npm install
npm run dev

# API Gateway
cd api-gateway
npm install
npm run start:dev

# User Service
cd user-service
npm install
npm run start:dev

# Task Service
cd task-service
npm install
npm run start:dev

# Notification Service
cd notification-service
npm install
npm run start:dev
```

2. Set up databases:
- MongoDB for user-service and notification-service
- PostgreSQL for task-service

3. Configure environment variables (create .env files in each service)

## Features

- User authentication (JWT)
- Role-based access control (Admin, Manager, Employee)
- Real-time task updates
- Drag-n-drop task management
- Task comments and attachments
- Real-time notifications
