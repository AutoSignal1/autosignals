//Email
import moment from 'moment';

//Notification

//Otp
export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = moment().add(30, 'm');

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const accountSid = 'AC75a60dec7e5cedcc059dad6d53945cc9';
  const authToken = 'ce5c60773014a1e39c2cc363b8076374';
  const client = require('twilio')(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: '+18597109024',
    to: `+234${toPhoneNumber}`,
  });

  return response;
};

//PaymentNotification
