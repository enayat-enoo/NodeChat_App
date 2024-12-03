import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookies from "../utils/generatetoken.js";
export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }
    //Password Hashing with bcrypt
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilepic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    const savedUser = await newUser.save();
    if (savedUser) {
      //JWT token
      generateTokenAndSetCookies(savedUser._id, res);
      return res.status(201).json({ message: "User created successfully" });
    } else {
      return res.status(400).json({ message: "Invalid User Input" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        error: messages,
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const {username, password}=req.body;
    const user= await User.findOne({username});
    const isPasswordCorrect= await bcryptjs.compare(password, user?.password || "");
    if(!user ||!isPasswordCorrect){
      return res.status(401).json({error:"Invalid credentials"});
    }
    generateTokenAndSetCookies(user.id,res);
    res.status(200).json({
      message:"Login successful",
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        error: messages,
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
  } catch (error) {
    if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message);
        return res.status(400).json({
          error: messages,
        });
      }
      res.status(500).json({ error: "Internal server error" });
  }
};
