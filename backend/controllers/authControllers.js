import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"

export const signup = async (req, res) => {
  try {
    const { username, fullname, password, email } = req.body
    if (!username || !fullname || !password || !email) {
      return res.status(400).json({ Error: "Fields cannot be empty" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ Error: "Invalid email format" })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ Error: "Username already in use" })
    }

    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ Error: "Email already in use" })
    }

    if (password?.length < 6) {
      return res
        .status(400)
        .json({ Error: "Password length should be atleast 6" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
    })
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save()
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      })
    } else {
      res.status(400).json({ Error: "Invalid user data" })
    }
  } catch (error) {
    console.log("Error in signup", error.message)
    res.status(500).json({ Error: "Internal server error" })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ Error: "Fields cannot be empty" })
    }
    const user = await User.findOne({ username })

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    )
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ Error: "Invalid credentials" })
    }
    generateTokenAndSetCookie(user._id, res)
    res.status(201).json({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    })
  } catch (error) {
    console.log("Error in login", error.message)
    res.status(500).json({ Error: "Internal server error" })
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ Message: "Logged out successfuly" })
  } catch (error) {
    console.log("Error in logout", error.message)
    res.status(500).json({ Error: "Internal server error" })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.status(200).json(user)
  } catch (error) {
    console.log("Error in getMe controller", error.message)
    res.status(500).json({ Error: "Internal server error" })
  }
}
