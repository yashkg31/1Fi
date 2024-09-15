import { Router } from 'express';
import { registerTempUser, resendOtp, verifyOtp } from '../controllers/userController.js';

const router = Router();

router.post('/register', registerTempUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

export default router;
