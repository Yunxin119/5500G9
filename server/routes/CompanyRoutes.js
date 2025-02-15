import express from 'express';
const router = express.Router();
import { protectMiddleware } from '../middleware/authMiddleware.js';
import { getCompanies, addCompany, updateCompany, deleteCompany, getCompaniesByUserId } from '../controllers/CompanyControllers.js';

router.route('/').get(protectMiddleware, getCompanies)
router.route('/add').post(protectMiddleware, addCompany)
router.route('/:id').put(protectMiddleware, updateCompany).delete(protectMiddleware, deleteCompany)
router.route('/user/:id').get(getCompaniesByUserId)

export default router;
