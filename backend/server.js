import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/authRoute.js"
import postRoute from "./routes/postRoute.js"
import userRoute from "./routes/userRoute.js"
import notificationRoute from "./routes/notificationRoute.js"
import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser"
import { v2 as cloudinary } from "cloudinary"
import path from "path"

dotenv.config()
const PORT = process.env.PORT || 5000
const __dirname = path.resolve()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()

app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/notifications", notificationRoute)

// if (process.env.NODE_ENV === "production")
app.use(express.static(path.join(__dirname, "frontend/dist")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})

app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running on port ${PORT}`)
})
