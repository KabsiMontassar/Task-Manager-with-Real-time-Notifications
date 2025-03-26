Task Management System with Real-time Notifications
This is a task management system built using microservices architecture, with real-time notifications and drag-n-drop task management features.

Project Structure
bash
Copy
Edit
TaskManagment/
├── frontend/               # React frontend
├── api-gateway/           # API Gateway service
├── user-service/          # User management & authentication
├── task-service/          # Task and project management
└── notification-service/  # Real-time notifications
Tech Stack
Frontend
React (TypeScript)

Vite for fast development

ShadCN UI for design

Socket.io-client for real-time updates

DND Kit for drag-n-drop functionality

Backend
NestJS for microservices

MongoDB for User & Notification services

PostgreSQL for Task service

JWT for authentication

Socket.io for real-time features

Backend Architecture
Microservices
API Gateway

Central entry for requests

Handles authentication, routing, and WebSocket connections

User Service

Manages user profiles, JWT authentication, and roles (Admin, Manager, Employee)

Task Service

Manages tasks, projects, task assignments, comments, and attachments

Notification Service

Sends real-time notifications to users via WebSockets

Features
User Authentication: JWT-based login

Role-Based Access: Admin, Manager, and Employee roles

Real-time Task Updates: Tasks update in real-time

Drag-n-drop Task Management: Easily move tasks around

Task Comments & Attachments: Add comments and files to tasks

Notifications: Real-time notifications for task updates

Setup
Install Dependencies:

bash
Copy
Edit
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
Set up Databases:

MongoDB for User and Notification services

PostgreSQL for Task service

Configure Environment Variables:
Create .env files for each service.