# Task Management System

A task management system built with microservices, featuring real-time notifications and drag-n-drop task management.

## Project Structure

TaskManagment/
├── frontend/               # React TypeScript frontend with Vite 
├── api-gateway/           # API Gateway service
├── user-service/         # User authentication and management
├── task-service/        # Task and project management
└── notification-service/ # Real-time notifications
## Tech Stack

### Frontend
- React (TypeScript) with Vite
- ShadCN UI
- Socket.io for real-time updates
- DND Kit for drag-n-drop

### Backend
- NestJS microservices
- MongoDB (User & Notifications)
- PostgreSQL (Task service)
- JWT Authentication
- Socket.io for real-time

## Features
- User Authentication (JWT)
- Role-based access (Admin, Manager, Employee)
- Real-time task updates
- Drag-n-drop task management
- Task comments and attachments
- Real-time notifications

## Setup Instructions

1. Install dependencies:
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
Set up databases:

MongoDB for user and notification services

PostgreSQL for task service

Configure environment variables (.env files for each service)