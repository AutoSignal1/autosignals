import express from 'express';
import { RegisterUser, VerifyOtpReg, LoginUser, SelectAccountDetails } from '../controllers/Auth';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/register', RegisterUser);
// router.post('/verify-email', VerifyEmail);
router.post('/verifyotp', VerifyOtpReg);
router.post('/login', LoginUser);
router.post('/select-account', SelectAccountDetails);

router.use(Authenticate);

export { router as AuthRoutes };
