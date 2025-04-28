📚 Library Management System
A full-stack Library Management System built with React (Frontend) and Node.js, Express, MongoDB (Backend).
The system supports user authentication, book management, borrowing/returning system, admin management, and automated services like sending reminders and account cleanup.

🚀 Live Demo :-https://bookworm-library-1.onrender.com

✨ Features
🔹User Registration with OTP Email Verification
🔹JWT-based Authentication and Authorization
🔹Password Reset and Update
🔹Admin and User Roles
🔹Book Management (Add, View, Delete)
🔹Borrow and Return Books with Fine Calculation
🔹Cloudinary Integration for Media Uploads
🔹Automated Email Notifications for Due Books
🔹Automatic Removal of Unverified Accounts
🔹Secure API with Error Handling

🛠 Backend Tech Stack
🔹Node.js
🔹Express.js
🔹MongoDB with Mongoose
🔹Cloudinary (for file storage)
🔹Nodemailer (for email services)
🔹bcrypt (for password hashing)
🔹JWT (JSON Web Tokens for authentication)
🔹Node-cron (for scheduling automated tasks)
🔹dotenv (environment variables)

🛠 Frontend Tech Stack
React.js
(Deployed separately and interacts with the backend via REST APIs)

📋 API Endpoints Overview


| Method | Endpoint                | Description                  |
| :----- | :---------------------- | :--------------------------- |
| POST   | /api/auth/register       | Register User                |
| POST   | /api/auth/verify-otp      | Verify OTP                   |
| POST   | /api/auth/login           | Login User                   |
| POST   | /api/auth/forgot-password | Forgot Password Request      |
| PUT    | /api/auth/reset-password  | Reset Password               |
| GET    | /api/auth/logout          | Logout User                  |
| GET    | /api/user/profile         | Get Logged-in User Profile   |
| POST   | /api/book/add             | Add Book (Admin Only)        |
| GET    | /api/book/all             | Get All Books                |
| DELETE | /api/book/:id             | Delete Book (Admin Only)     |
| POST   | /api/borrow/borrow        | Borrow Book                  |
| POST   | /api/borrow/return        | Return Borrowed Book         |
| GET    | /api/borrow/user          | Get Borrowed Books (User)    |
| GET    | /api/borrow/admin         | Get Borrowed Books (Admin)   |

📦 Installation & Setup

🔴Clone the repository
git clone https://github.com/your-username/library-management-system.git
cd library-management-system/backend

🔴Install dependencies
npm install


🔴Create a config/config.env file and add the following environment variables:

PORT=4000
FRONTEND_URL=http://localhost:3000

MONGO_URI=your_mongodb_connection_string

SMTP_HOST=smtp.gmail.com
SMTP_SERVICE=gmail
SMTP_PORT=465
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_email_password

JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

CLOUDINARY_CLIENT_NAME=your_cloudinary_name
CLOUDINARY_CLIENT_API=your_cloudinary_api_key
CLOUDINARY_CLIENT_SECRET=your_cloudinary_api_secret

Run the server
npm start

Make sure the React frontend is running separately (typically on port 3000).

📢 Automation
notifyUsers.js — Sends reminder emails for upcoming or overdue books.

removeUnverifiedAccounts.js — Deletes unverified accounts after a certain time.

🚀 Demo Login (For Testing)
Quickly test the admin features with these credentials:

🔹 Email: nikhil.anand@msca.christuniversity.in
🔹 Password: 12345678

🔴 Testing Steps:
Go to the Login Page (/login).

Enter the following credentials:

Email: nikhil.anand@msca.christuniversity.in

Password:12345678

Click Login → You will be redirected to the Admin Dashboard.

✅ Now you can explore Admin functionalities like adding, viewing borrowed books, and managing users!
