# Marginalia — MERN Blog Platform

A full-stack blogging platform where users can write, publish, and manage their own blog posts.Built with MongoDB, Express, React, and Node.js.


## Features

- Authentication & Authorization- JWT-based signup/login; only logged-in users can create or manage posts
- Create, edit, and delete blog posts 
- Comments — add, edit, and delete comments on any post
- Likes — like/unlike posts, with live counts
- Ownership rules — only the author of a post/comment can edit or delete it
- Search— filter posts by title or author on the home feed
- Responsive UI— built with Tailwind CSS

### OUTPUT:
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/522a6f45-95ec-4ab6-a3a8-7aaecf4f44fd" />

🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios
- Context API for auth state

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing
- Multer for image uploads

## Project Structure

Blog Platform/
├── server/             
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/
│   └── server.js
└── client/               
├── src/
│   ├── api/
│   ├── context/
│   ├── components/
│   ├── pages/
│   └── App.jsx
└── vite.config.js

### Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local MongoDB or [MongoDB Atlas])
  
### STEPS

### 1. Clone the repo
-  git clone https://github.com/TruptiKoundade/Blog-Platform.git
-  cd "Blog Platform"

### 2. Set up the backend

-  cd server
-  npm install

Create a .env file inside server/ (this is not included in the repo since it's in .gitignore — every person running it needs their own):

-  PORT=3000
-  MONGODB_URI=your_mongodb_connection_string
-  JWT_SECRET=any_random_secret_string

Run the server:
-  npm run dev

Backend runs on http://localhost:3000.

### 3. Set up the frontend

-  cd client
-  npm install
-  npm run dev

The app runs on `http://localhost:5173` 

### 4. Open the app

Visit `http://localhost:5173`, create an account, and start writing.

