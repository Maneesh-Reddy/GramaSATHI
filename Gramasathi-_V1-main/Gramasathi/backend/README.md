# GramaSathi Backend

This is the backend server for the GramaSathi platform, providing APIs for user authentication, charity campaign management, and real-time communication.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO for real-time features
- JWT for authentication
- Multer for file uploads

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gramasathi
   JWT_SECRET=your_secret_key
   FRONTEND_URL=http://localhost:5173
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. For production, use:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Charity Campaigns
- `GET /api/charity` - Get all charity campaigns
- `GET /api/charity/:id` - Get a single charity campaign
- `POST /api/charity` - Create a new charity campaign
- `PUT /api/charity/:id` - Update a charity campaign
- `POST /api/charity/:id/donate` - Donate to a campaign
- `POST /api/charity/:id/update` - Add an update to a campaign

### User Profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/upload-picture` - Upload profile picture
- `GET /api/profile/my-campaigns` - Get user's charity campaigns
- `GET /api/profile/my-donations` - Get user's donations
- `PUT /api/profile/change-password` - Change password

## Socket.IO Events

- `connection` - User connected
- `disconnect` - User disconnected
- `send_message` - Send a message
- `receive_message` - Receive a message
- `join_campaign` - Join a campaign room

## Directory Structure

```
backend/
├── src/
│   ├── index.js         # Entry point
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── middleware/      # Middleware functions
├── uploads/             # Uploaded files
├── .env                 # Environment variables
├── package.json
└── README.md
``` 