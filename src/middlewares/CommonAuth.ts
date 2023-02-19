import { Request, Response, NextFunction } from 'express';
import { SignaturePayload } from '../dto';
import { ValidateSignature } from '../utility';

declare global {
  namespace Express {
    interface Request {
      user?: SignaturePayload;
    }
  }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const validate = await ValidateSignature(req);

  if (validate) {
    next();
  } else {
    return res.json({ message: 'User Not Authorized' });
  }
};
