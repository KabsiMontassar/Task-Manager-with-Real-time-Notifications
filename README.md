TASK-MANAGER-WITH-REAL-TIME-NOTIFICATIONS
=========================================

_Empower Your Productivity with Instant Task Updates_

![last-commit](https://img.shields.io/github/last-commit/KabsiMontassar/Task-Manager-with-Real-time-Notifications?style=flat&logo=git&logoColor=white&color=0080ff) ![repo-top-language](https://img.shields.io/github/languages/top/KabsiMontassar/Task-Manager-with-Real-time-Notifications?style=flat&color=0080ff) ![repo-language-count](https://img.shields.io/github/languages/count/KabsiMontassar/Task-Manager-with-Real-time-Notifications?style=flat&color=0080ff)

_Built with the tools and technologies:_

![JSON](https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101.svg?style=flat&logo=socketdotio&logoColor=white) ![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white) ![Autoprefixer](https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat&logo=Autoprefixer&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-FE0803.svg?style=flat&logo=TypeORM&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-F04D35.svg?style=flat&logo=Mongoose&logoColor=white) ![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=black) ![.ENV](https://img.shields.io/badge/.ENV-ECD53F.svg?style=flat&logo=dotenv&logoColor=black) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black) ![Passport](https://img.shields.io/badge/Passport-34E27A.svg?style=flat&logo=Passport&logoColor=white)  
![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black) ![Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white) ![tsnode](https://img.shields.io/badge/tsnode-3178C6.svg?style=flat&logo=ts-node&logoColor=white) ![GitHub%20Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=flat&logo=GitHub-Actions&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white) ![CSS](https://img.shields.io/badge/CSS-663399.svg?style=flat&logo=CSS&logoColor=white) ![datefns](https://img.shields.io/badge/datefns-770C56.svg?style=flat&logo=date-fns&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-C21325.svg?style=flat&logo=Jest&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)

---

## Overview

**Task-Manager-with-Real-time-Notifications** is a powerful microservice designed to streamline task management and enhance user engagement through real-time updates.

---

## Features

- 🚀 **Microservice Architecture:** Independent deployment and scaling for enhanced modularity.
- 📋 **Task Management:** Comprehensive endpoints for creating, updating, and deleting tasks.
- 🔔 **Real-time Notifications:** Immediate feedback on task updates.
- 🔗 **Integration with Other Services:** Seamless communication between microservices.
- ✅ **Robust Testing Framework:** Ensures code reliability.
- 🛠️ **TypeScript Support:** Promotes type safety and maintainability.

---

## Technologies

This project leverages the following technologies:

- **Frontend:** React, TypeScript, Axios, Chakra UI, DnD Kit
- **Backend:** NestJS, TypeORM, Mongoose, Passport.js
- **Database:** PostgreSQL, MongoDB
- **DevOps:** Docker, GitHub Actions
- **Testing:** Jest, Mocha, Chai

---

## Project Structure

```plaintext
Task-Manager-with-Real-time-Notifications/
├── api-gateway/         # Gateway for microservices
├── task-service/        # Task management microservice
├── user-service/        # User management microservice
├── frontend/            # React-based frontend
├── .github/             # GitHub Actions workflows
└── README.md            # Project documentation
```

---

## Getting Started

### Prerequisites

- **Programming Language:** TypeScript
- **Package Manager:** npm
- **Container Runtime:** Docker

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KabsiMontassar/Task-Manager-with-Real-time-Notifications
   cd Task-Manager-with-Real-time-Notifications
   ```

2. Install dependencies:
   - Using Docker:
     ```bash
     docker build -t KabsiMontassar/Task-Manager-with-Real-time-Notifications .
     ```
   - Using npm:
     ```bash
     npm install
     ```

### Usage

Run the project:
- Using Docker:
  ```bash
  docker run -it {image_name}
  ```
- Using npm:
  ```bash
  npm start
  ```

### Testing

Run the test suite:
- Using Docker:
  ```bash
  echo 'INSERT-TEST-COMMAND-HERE'
  ```
- Using npm:
  ```bash
  npm test
  ```

---

[⬆ Return to Top](#task-manager-with-real-time-notifications)
