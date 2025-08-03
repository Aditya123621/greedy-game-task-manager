import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  googleCallback 
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.post('/google/callback', googleCallback);

export default router;
