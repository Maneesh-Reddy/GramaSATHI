# GramaSathi – A Rural Empowerment Platform

GramaSathi is a full-stack web platform designed to digitally empower rural communities by providing easy access to essential services such as healthcare, education, employment, agriculture guidance, grievance redressal, and environmental awareness.

## Description

GramaSathi is a web platform designed to empower rural communities by providing easy access to healthcare, education, jobs, agriculture tips, grievance submission, and environmental awareness. It integrates weather and maps APIs and is optimized for low-bandwidth and user-friendly access.

## Features

- Health Sathi – Locate nearby hospitals and access health camps and awareness content  
- Edu Sathi – Access digital learning resources and study materials  
- Krishi Sathi – Get real-time weather updates and farming tips  
- Rozgar Sathi – View local job opportunities and upload resumes  
- Grievance Box – Submit complaints and track their status  
- Eco Sathi – Learn about environmental sustainability and green practices

## Tech Stack

Frontend:
- React.js  
- Tailwind CSS  
- React Router  
- Axios  
- Google Maps API  
- Weather API

Backend:
- Node.js  
- Express.js  
- JWT Authentication  
- Multer for file uploads

Database:
- MongoDB  
- Mongoose

## Prerequisites

Before setup, ensure the following are installed:
- Node.js (version 16 or above)  
- MongoDB (local or cloud-based using MongoDB Atlas)  
- Git  
- A web browser like Chrome

## Setup Instructions

1. Clone the project repository using Git:
   git clone <your-repo-link>

2. Navigate to the main project folder:
   cd Gramasathi_Final/Gramasathi

### Frontend Setup

- Navigate to the frontend folder named "Gramasathi":
  cd Gramasathi
- Install dependencies:
  npm install
- Start the frontend development server:
  npm run dev
- The frontend runs on:
  http://localhost:5173

### Backend Setup

- Open a new terminal window and navigate to the backend folder:
  cd backend
- Install dependencies:
  npm install
- Create a .env file inside the backend folder with the following variables:
  PORT=5000  
  MONGO_URI=your MongoDB connection string  
  JWT_SECRET=your secret key
- Start the backend server:
  npm run dev
- The backend runs on:
  http://localhost:5000

## Running the Application

Frontend:
- Navigate to the Gramasathi folder  
- Run: npm run dev  
- Access the frontend at: http://localhost:5173

Backend:
- Navigate to the backend folder  
- Run: npm run dev  
- Access the backend at: http://localhost:5000

## Folder Structure

Gramasathi  
├── backend  
│   └── src  
│       ├── models  
│       ├── routes  
│       └── index.js  
├── frontend  
│   └── src  
│       ├── components  
│       ├── pages  
│       └── App.jsx

## Authentication

The platform uses JWT-based authentication for secure user login and role-based access control (User and Admin).

## API Integrations

- Weather API for Krishi Sathi module  
- Google Maps API for Health Sathi module

## Contact

For queries or suggestions, please reach out.
