import verify from "./middleware/verify.js"
import cors from "cors"
import express from "express"
import mongoose from 'mongoose';
import session from "express-session"
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
const app = express()
const port = 3001
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
  }
}))
app.use(cors({
  origin: "*",
}))


app.get("/", (req, res) => {
  res.send("hello world!!!!");
})

app.get("/protected", verify, (req, res) => {
  res.send("you are logged in")
})

app.use('/api/auth', userRoutes)
app.use('/api/posts', postRoutes)
app.listen(port, async () => {
  await mongoose.connect('mongodb+srv://atib:cilangkap35@cluster0.3dfcni1.mongodb.net/blogpost',);
  console.log('Connected to MongoDB');
  console.log("server connected at port", port)
}) 