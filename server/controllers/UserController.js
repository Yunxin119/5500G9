import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateTokenAndCookie from "../middleware/generateTokenAndCookie.js";
import nodemailer from "nodemailer";
import OpenAI from "openai";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PDFExtract } from "pdf.js-extract";

// Initialize DeepSeek client using OpenAI SDK
const deepseek = new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey:
        process.env.DEEPSEEK_API_KEY || "sk-d2ba0e552cd4424aa7e68ffe7b1544da",
});

// Initialize PDF extractor
const pdfExtract = new PDFExtract();
const extractOptions = {}; // default options

// Function to get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ users: users.map((user) => user.toJSON()) });
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch users" });
    }
};

// Register a new user
export const register = async (req, res) => {
    try {
        const { username, password, confirmPassword, email, gender } = req.body;

        // Input validation
        if (!username || !password || !email || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return res.status(400).json({
                message:
                    existingUser.username === username
                        ? "Username already exists"
                        : "Email already exists",
            });
        }

        // Validate password match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Validate password strength
        if (password.length < 6) {
            return res
                .status(400)
                .json({
                    message: "Password must be at least 6 characters long",
                });
        }

        // Generate profile picture URL based on gender
        const profilePic =
            gender === "male"
                ? `https://avatar.iran.liara.run/public/boy?username=${username}`
                : gender === "female"
                ? `https://avatar.iran.liara.run/public/girl?username=${username}`
                : `https://avatar.iran.liara.run/public/username=${username}`;

        // Create new user instance
        const newUser = new User({
            username,
            email,
            gender,
            profilePic,
            isVerified: false,
            applications: [],
        });

        // Hash and set the password
        await newUser.setPassword(password);

        // Save the new user
        const savedUser = await newUser.save();

        // Generate token and set cookie
        const token = generateTokenAndCookie(savedUser._id, res);

        // Prepare response data
        const userData = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            gender: savedUser.gender,
            profilePic: savedUser.profilePic,
            isVerified: savedUser.isVerified,
            token,
        };

        // Send success response
        res.status(201).json(userData);
    } catch (error) {
        console.error("Registration error:", error);

        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Username or email already exists",
            });
        }

        res.status(500).json({
            message: "Error registering user",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

// loginUser controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch)
            return res.status(401).json({ msg: "Invalid email or password" });

        if (user && isMatch) {
            const token = generateTokenAndCookie(user._id, res);

            console.log("Setting cookie in response:", {
                token,
                cookieHeader: res.getHeader("Set-Cookie"),
            });

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
                token,
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
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

        const { username, email, password, confirmPassword, gender, role } =
            req.body;

        user.username = username || user.username;
        user.email = email || user.email;
        if (user.gender !== gender) {
            gender === "male"
                ? (user.profilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`)
                : gender === "female"
                ? (user.profilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`)
                : (user.profilePic = `https://avatar.iran.liara.run/public/username=${username}`);
        }
        user.gender = gender || user.gender;

        if (role) {
            const validRoles = ["admin", "user", "superuser"];
            if (!validRoles.includes(role)) {
                return res
                    .status(400)
                    .json({
                        msg: `Invalid role. Valid roles are: ${validRoles.join(
                            ", "
                        )}`,
                    });
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

        res.status(200).json({
            msg: "Email verified successfully. You are now a superuser.",
        });
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

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

// Process uploaded PDF file and extract text
export const processPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }

        // Use pdf.js-extract to extract text
        try {
            const data = await pdfExtract.extract(
                req.file.path,
                extractOptions
            );

            // Concatenate all page content
            let extractedText = "";
            if (data && data.pages) {
                data.pages.forEach((page) => {
                    if (page.content) {
                        page.content.forEach((item) => {
                            extractedText += item.str + " ";
                        });
                        extractedText += "\n\n"; // Add line breaks between pages
                    }
                });
            }

            // Extract metadata
            const metadata = {
                pageCount: data.pages.length,
                info: data.meta || {},
            };

            // Remove the temporary file
            fs.unlinkSync(req.file.path);

            return res.status(200).json({
                message: "PDF processed successfully",
                text: extractedText.trim(),
                metadata,
            });
        } catch (pdfError) {
            console.error("PDF extraction error:", pdfError);

            // Fallback for non-PDF files or if extraction fails
            if (
                req.file.mimetype === "application/msword" ||
                req.file.mimetype ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                // For Word documents, we'll need to send back a message
                // since we don't have a direct extraction method here
                fs.unlinkSync(req.file.path);

                return res.status(200).json({
                    message:
                        "Document processed. Note: Text extraction from Word documents is limited.",
                    text: "Word document content. Please consider uploading a PDF for better results.",
                    metadata: { type: req.file.mimetype },
                });
            }

            throw pdfError;
        }
    } catch (error) {
        console.error("Error processing PDF:", error);

        // Remove the temporary file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            message: "Failed to process PDF file",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Server error",
        });
    }
};

// Generate a cover letter using DeepSeek API
export const generateCoverLetter = async (req, res) => {
    try {
        let { resume, jobDescription, pdfText } = req.body;

        // If pdfText is provided, use it instead of resume text
        if (pdfText) {
            resume = pdfText;
        }

        if (!resume || !jobDescription) {
            return res
                .status(400)
                .json({ message: "Resume and job description are required" });
        }

        console.log("Starting cover letter generation with DeepSeek API");
        console.log(
            `API Key: ${
                process.env.DEEPSEEK_API_KEY ? "Available" : "Not available"
            }`
        );

        const estimateTokens = (text) => Math.ceil(text.length / 4);

        const resumeTokens = estimateTokens(resume);
        const jobDescriptionTokens = estimateTokens(jobDescription);

        console.log(
            `estimated tokens, resule: ${resumeTokens}, jd: ${jobDescriptionTokens}`
        );

        const MAX_TOTAL_TOKENS = 40000;
        const MAX_TOKENS_PER_SECTION = 20000;

        if (resumeTokens + jobDescriptionTokens > MAX_TOTAL_TOKENS) {
            const ratio = resumeTokens / (resumeTokens + jobDescriptionTokens);
            const maxResumeTokens = Math.min(
                Math.floor(MAX_TOTAL_TOKENS * ratio),
                MAX_TOKENS_PER_SECTION
            );
            const maxJobDescTokens = Math.min(
                MAX_TOTAL_TOKENS - maxResumeTokens,
                MAX_TOKENS_PER_SECTION
            );

            if (resumeTokens > maxResumeTokens) {
                const charLimit = maxResumeTokens * 4;
                resume =
                    resume.substring(0, charLimit) +
                    "... [Content too long, auto-truncated]";
            }

            if (jobDescriptionTokens > maxJobDescTokens) {
                const charLimit = maxJobDescTokens * 4;
                jobDescription =
                    jobDescription.substring(0, charLimit) +
                    "... [Content too long, auto-truncated]";
            }
        }

        // Prepare the prompt for cover letter generation
        const prompt = `
            Generate a professional cover letter based on the following resume and job description.
            
            RESUME:
            ${resume}
            
            JOB DESCRIPTION:
            ${jobDescription}
            
            Please create a well-structured cover letter that highlights the relevant skills and experiences from the resume that match the job requirements.
            Please only include the cover letter, no other text. Please do not include any other text like "Here is the cover letter" or "Cover letter:" or anything like that.
            Please try to get the information like contact info and others from the resume and job description, try not to leave any blank. So user can copy and use it directly.
            Tailor user's experience to the job description.
            The cover letter should be personalized, professional, and persuasive. 
            Include a proper greeting, introduction, body paragraphs that demonstrate value, and a conclusion with a call to action.
            
            Format the cover letter using Markdown for better readability. IMPORTANT: Use double line breaks (empty lines) between different sections of the cover letter to ensure proper spacing when displayed.
        `;

        try {
            // Call DeepSeek API
            const completion = await deepseek.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a professional cover letter writer with expertise in crafting compelling, tailored cover letters that help job applicants stand out.",
                    },
                    { role: "user", content: prompt },
                ],
                model: "deepseek-chat",
                max_tokens: 2000,
                temperature: 0.7,
            });

            // Extract the generated cover letter
            const coverLetter = completion.choices[0].message.content;
            console.log("Cover letter generated successfully");
            // Log the raw cover letter content for debugging
            console.log("========= RAW COVER LETTER CONTENT =========");
            console.log(coverLetter);
            console.log("===========================================");
            // fs.writeFileSync('cover-letter-debug.md', coverLetter, 'utf8');

            // Return the generated cover letter
            res.status(200).json({ coverLetter });
        } catch (apiError) {
            console.error("DeepSeek API Error:", apiError);

            // If there's an API error, try to provide a simple cover letter as fallback
            const fallbackCoverLetter = `
# Professional Cover Letter

Dear Hiring Manager,

I am writing to express my strong interest in the position as advertised. After reviewing the job description, I believe my skills and experiences align well with your requirements.

## Why I'm a Good Fit

Based on my resume, I have developed relevant skills that would be valuable for this role. I am confident that I can make a positive contribution to your team.

## My Interest in This Role

The opportunity to work with your organization particularly appeals to me because of its reputation and the chance to apply my expertise in a new environment.

## Closing

I would welcome the opportunity to discuss my qualifications further. Thank you for considering my application.

Sincerely,
[Your Name]
`;

            console.log("Using fallback cover letter due to API error");
            res.status(200).json({
                coverLetter: fallbackCoverLetter,
                isApiError: true,
                message:
                    "Failed to generate cover letter, using fallback template",
            });
        }
    } catch (error) {
        console.error("Error generating cover letter:", error);
        res.status(500).json({
            message: "Failed to generate cover letter",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Server error",
        });
    }
};

// Extract job information from job description
export const extractJobInfo = async (req, res) => {
    try {
      const { jobDescription } = req.body;
      
      if (!jobDescription) {
        return res.status(400).json({ message: "Job description is required" });
      }
  
      console.log("Starting job info extraction with AI");
      
      // Prepare prompt for the AI
      const prompt = `
        Extract the following information from this job description, and respond with ONLY a JSON object:
        1. Company name
        2. Job title/role
        3. Location/city
        4. Any application deadline if mentioned (format MM/DD/YYYY)
        
        Return ONLY a JSON object with these fields: name, role, city, deadline
        If you can't find a particular field, use null for that field.
        
        Job Description:
        ${jobDescription}
      `;
  
      // Use the same OpenAI SDK approach as for cover letter generation
      try {
        // Call DeepSeek API using the SDK instead of axios
        const completion = await deepseek.chat.completions.create({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 500
        });
  
        let extractedInfo;
        try {
            // Extract the JSON response from the AI output
            const content = completion.choices[0].message.content;
            console.log("========= RAW extract CONTENT =========");
            console.log(content);
            console.log("===========================================");
            
            // Clean the content by removing Markdown code block syntax if present
            let cleanContent = content;
            
            // Check if the content is wrapped in code blocks
            const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
            const match = content.match(jsonRegex);
            
            if (match && match[1]) {
              cleanContent = match[1].trim();
            }
            
            // Parse the cleaned JSON
            extractedInfo = JSON.parse(cleanContent);
          } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            extractedInfo = {
              name: null,
              role: null,
              city: null,
              deadline: null
            };
          }
  
        // Format current date as MM/DD/YYYY for default apply date
        const today = new Date();
        const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  
        res.status(200).json({
          name: extractedInfo.name || "",
          role: extractedInfo.role || "",
          city: extractedInfo.city || "",
          applyDate: extractedInfo.deadline || formattedDate,
          status: "Submitted"
        });
      } catch (error) {
        console.error("AI extraction error:", error);
        
        // Fallback to sending basic info
        const today = new Date();
        const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        
        res.status(200).json({
          name: "",
          role: "",
          city: "",
          applyDate: formattedDate,
          status: "Submitted"
        });
      }
    } catch (error) {
      console.error("Error in extractJobInfo:", error);
      res.status(500).json({
        message: "Failed to extract job information",
        error: process.env.NODE_ENV === 'development' ? error.message : "Server error"
      });
    }
};