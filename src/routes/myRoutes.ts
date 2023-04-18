import express from 'express';
import {
  RegisterUser,
  VerifyOtpReg,
  LoginUser,
  SelectAccountDetails,
  SetUpCredentials,
} from '../controllers/Auth';
import {
  CreateTrade,
  fetchMyOrders,
  fetchTicker,
  getMyBalances,
  loadMarketSymbols,
} from '../controllers/Trade';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/register', RegisterUser);
// router.post('/verify-email', VerifyEmail);
router.post('/verifyotp', VerifyOtpReg);
router.post('/login', LoginUser);
router.post('/select-account', SelectAccountDetails);

router.use(Authenticate);

router.post('/set-credentials', SetUpCredentials);

router.get('/getbalance', getMyBalances);
router.get('/myorders', fetchMyOrders);
router.get('/load-market-symbols', loadMarketSymbols);
router.post('/fetchticker', fetchTicker);
router.post('/create-trade', CreateTrade);

export { router as MyRoutes };
