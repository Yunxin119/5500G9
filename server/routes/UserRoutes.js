import express from 'express';
const router = express.Router();
import { getAllUsers, register, login, logout, getUserProfile, deleteUser, editProfile, verifyEmail, sendVerificationEmail, generateCoverLetter, processPdf, extractJobInfo } from '../controllers/UserController.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, and DOCX files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

// Create uploads directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

router.route('/').get(getAllUsers)
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/:id').get(getUserProfile).delete(deleteUser).put(editProfile)
router.route("/send-verification-email").post(sendVerificationEmail);
router.route("/verify/verify-email").get(verifyEmail);
router.route("/generate-cover-letter").post(generateCoverLetter);
router.route("/process-pdf").post(upload.single('pdfFile'), processPdf);
router.route('/extract-job-info').post(extractJobInfo);

export default router;