// import express from "express";
// import{config} from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import { connectDB } from "./database/db.js";
// import{errorMiddleware} from "./middlewares/errorMiddlewares.js";
// import authRouter from "./routes/authRouter.js";
// import bookRouter from "./routes/bookRouter.js";
// import borrowRouter from "./routes/borrowRouter.js";
// import userRouter from "./routes/userRouter.js";
// import expressFileupload from"express-fileupload";
// import {  notifyUsers } from "./services/notifyUsers.js";
// import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

// export const app=express();
// config({path: "./config/config.env"});

// app.use(cors({
//     origin:[process.env.FRONTEND_URL],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials:true,
// }));


// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true}));
// app.use(expressFileupload({
//     useTempFiles:true,
//     tempFileDir:"/tmp/"
// }))

// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/book", bookRouter);
// app.use("/api/v1/borrow",borrowRouter);
// app.use("/api/v1/user",userRouter);

// notifyUsers();
// removeUnverifiedAccounts();

// connectDB();

// app.use(errorMiddleware);

import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";
import expressFileupload from "express-fileupload";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

// Initialize Redis client
let redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

(async () => {
  await redisClient.connect();
})();

export const app = express();

// Load environment variables
config({ path: "./config/config.env" });

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  exposedHeaders: ["set-cookie"]
}));

// Session middleware with Redis store
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'your-strong-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? 
      new URL(process.env.FRONTEND_URL).hostname : undefined
  }
}));

// Standard middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileupload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));

// JWT verification middleware (if using JWT)
app.use((req, res, next) => {
  const token = req.cookies.token || 
                req.headers['authorization']?.split(' ')[1] || 
                req.session.token;

  if (token) {
    try {
      // Verify token (example using jsonwebtoken)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      req.token = token;
    } catch (err) {
      // Clear invalid token
      res.clearCookie('token');
      if (req.session) {
        req.session.token = null;
      }
    }
  }
  next();
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

// Debug endpoints (can be removed in production)
app.get('/api/v1/debug/session', (req, res) => {
  res.json({
    session: req.session,
    cookies: req.cookies,
    headers: req.headers
  });
});

app.get('/api/v1/debug/env', (req, res) => {
  res.json({
    frontendUrl: process.env.FRONTEND_URL,
    nodeEnv: process.env.NODE_ENV,
    redisConnected: redisClient.isReady
  });
});

// Background services
notifyUsers();
removeUnverifiedAccounts();

// Database connection
connectDB();

// Error middleware
app.use(errorMiddleware);