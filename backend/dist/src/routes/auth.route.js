import express from 'express';
import { login, logout, signup, getMe } from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();
// http://localhost:5000/api/auth/login
router.post('/login', login);
// http://localhost:5000/api/auth/logout
router.post('/logout', logout);
// http://localhost:5000/api/auth/signup
router.post('/signup', signup);
// http://localhost:5000/api/auth/signup
router.get('/me', protectRoute, getMe);
export default router;
