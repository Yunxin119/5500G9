import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateTokenAndCookie from "../middleware/generateTokenAndCookie.js";
import nodemailer from "nodemailer";

// Function to get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ users: users.map(user => user.toJSON()) });
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch users" });
    }
};

// Register a new user
export const register = async (req, res) => {
    try {
        const { username, password, confirmPassword, email, gender } = req.body;

        if (await User.findOne({ username })) {
            return res.status(400).json({ msg: "User already exists" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }

        const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const profilePic = `https://avatar.iran.liara.run/public/username=${username}`;

        // Create new user instance
        const newUser = new User({
            username,
            email,
            gender,
            profilePic: gender === "male" ? maleProfilePic : gender === "female" ? femaleProfilePic : profilePic
        });

        // Set the hashed password using the method defined in the schema
        await newUser.setPassword(password);

        // Save the new user
        await newUser.save();

        const token = generateTokenAndCookie(newUser._id, res);
        newUser.token = token;
        
        res.status(201).json(newUser.toJSON());
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
};

// Login an existing user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ msg: "Invalid email or password" });

        const token = generateTokenAndCookie(user._id, res);
        user.token = token;
        console.log("User logged in");
        res.status(200).json(user.toJSON());
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Logout user
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ msg: "Successfully logged out" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: "User not found" });
        console.log("User profile retrieved");
        res.status(200).json(user.toJSON());
    } catch (error) {
        res.status(500).json({ msg: "Failed to retrieve user profile" });
    }
};

// Edit user profile
export const editProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        console.log(user);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const { username, email, password, confirmPassword, gender, role } = req.body;

        user.username = username || user.username;
        user.email = email || user.email;
        if (user.gender !== gender) {
            gender === "male" ? user.profilePic = `https://avatar.iran.liara.run/public/boy?username=${username}` :
            gender === "female" ? user.profilePic = `https://avatar.iran.liara.run/public/girl?username=${username}` :
            user.profilePic = `https://avatar.iran.liara.run/public/username=${username}`
        }
        user.gender = gender || user.gender;

        if (role) {
            const validRoles = ["admin", "user", "superuser"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ msg: `Invalid role. Valid roles are: ${validRoles.join(", ")}` });
            }
            user.role = role;
        }

        if (password) {
            if (password !== confirmPassword) {
                return res.status(400).json({ msg: "Passwords do not match" });
            }
            user.passwordHash = await bcrypt.hash(password, 10);
        }

        await user.save();

        const token = generateTokenAndCookie(user._id, res);
        user.token = token;
        res.status(200).json(user.toJSON());
    } catch (error) {
        res.status(400).json({ msg: error.message });
        console.log(error);
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: "User not found" });
        await User.deleteOne({ _id: id });
        await Post.deleteMany({ userId: id });
        await Comment.deleteMany({ userId: id });
        await Company.deleteMany({ user_id: id });
    
        res.status(200).json({ msg: "User deleted" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Email verification
export const verifyEmail = async (req, res) => {
    console.log("Verifying email...");
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ msg: "Token is required" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        user.isVerified = true;
        user.role = "superuser";
        await user.save();

        console.log("User updated successfully:", user);

        res.status(200).json({ msg: "Email verified successfully. You are now a superuser." });
    } catch (error) {
        console.error("Error verifying email: ", error);
        res.status(400).json({ msg: "Invalid or expired token" });
    }
};

// Verify email
export const sendVerificationEmail = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        console.log("Sending email to:", user.email);
        console.log("Verification URL:", verificationUrl);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Email Verification",
            text: `Please click the link below to verify your email address:\n${verificationUrl}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        res.status(200).json({ msg: "Verification email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ msg: "Failed to send verification email" });
    }
};