
# SaaS Learning Management Portal

This is a prototype of an enterprise-style SaaS Learning Management Portal designed to facilitate collaborative learning for teams. It allows admins to manage users, curate courses, and track team activities, while members can browse and engage with educational content in the form of sequential PDF-based courses.

## Features

- **User Roles & Access Levels**
  - **Admin**: Full control to manage users, curate courses, and track activities.
  - **Member**: Can browse, take courses, and engage in learning activities.

- **Course System**
  - Admins can curate courses by uploading PDF files.
  - Members can view the PDFs sequentially within a learning window.

- **Onboarding**
  - First user to sign up is automatically assigned the Admin role.
  - Admins can onboard additional team members and manage their roles.

- **Team Management**
  - Admins can add, remove, or modify team members and track their activities.

- **Authentication**
  - Supports secure user login via Google, Microsoft, and traditional email/password methods using auth.js.

## Tech Stack

- Frontend: [React](https://reactjs.org/)
- Backend: [Node.js](https://nodejs.org/) with Express
- Authentication: [Auth.js](https://authjs.dev/)(Next-auth)
- Database: [MongoDB](https://www.mongodb.com/)
