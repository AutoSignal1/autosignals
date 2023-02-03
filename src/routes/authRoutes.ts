import express from 'express';
import { RegisterUser, VerifyEmail, VerifyOtpReg, LoginUser } from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/verify-email', VerifyEmail);
router.post('/verify-otp-reg', VerifyOtpReg);
router.post('/login', LoginUser);

router.use(Authenticate);

export { router as AuthRoutes };
