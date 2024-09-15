import TempUser from '../models/tempUser.js';
import User from '../models/user.js';
import crypto from 'crypto';
import userSchema from "../zodSchema/zodSchema.js";
import nodemailer from "nodemailer"
import twilio from "twilio"

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
      user: 'yashkg51@gmail.com',
      pass: 'lnkl aemy otlz fsvm'
  }
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: 'yashkg51@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

const sendOtpSms = async (mobile, otp) => {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${mobile}`,
  });
};

export const registerTempUser = async (req, res) => {
  const {success} = userSchema.safeParse(req.body);

  if(!success){
    return res.status(411).json({
      message: "Wrong Inputs"
    })
  }

  const {name, password, mobile, email} = req.body;

  const existingTempUser = await TempUser.findOne({
    mobile,
    email
  });

  const mobileOtp = crypto.randomInt(100000, 999999).toString();
  const emailOtp = crypto.randomInt(100000, 999999).toString();

  const otpExpiry = new Date(Date.now() + 5*60*1000);

  if (existingTempUser) {
    const timeSinceLastRequest = Date.now() - new Date(existingTempUser.otpExpiry).getTime()+5*60*1000;
    
    if (timeSinceLastRequest < 60*1000) {
      return res.status(429).json({
        message: 'Please wait 60 seconds before requesting a new OTPs.'
      });
    }

    existingTempUser.mobileOtp = mobileOtp;
    existingTempUser.emailOtp = emailOtp;
    existingTempUser.otpExpiry = otpExpiry;
    await existingTempUser.save();

    try {
      await sendOtpEmail(email, emailOtp);
      await sendOtpSms(mobile, mobileOtp);
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to send OTP. Please try again.',
        error: error.message
      });
    }

    return res.status(200).json({
      message: 'New OTPs sent to mobile and email.'
    });

  }

  const tempUser = await TempUser.create({
    name,
    password,
    mobile,
    email,
    mobileOtp,
    emailOtp,
    otpExpiry
  });

  try {
    await sendOtpEmail(email, emailOtp);
    await sendOtpSms(mobile, mobileOtp);
  } catch (error) {
    await TempUser.deleteOne({ mobile, email });
    return res.status(500).json({
      message: 'Failed to send OTP. Please try again.',
      error: error.message
    });
  }

  res.status(201).json({
    message: 'OTPs sent to mobile and email.'
  });
};



export const verifyOtp = async (req, res) => {
  const MAX_ATTEMPTS = 5;
  const {mobile, mobileOtp, emailOtp} = req.body;

  const tempUser = await TempUser.findOne({
    mobile,
    email
  });

  if (!tempUser) {
    return res.status(400).json({
      message: 'Request OTPs again.'
    });
  }

  const isOtpExpired = tempUser.otpExpiry.getTime() < Date.now();

  if (isOtpExpired) {
    await TempUser.deleteOne({
      mobile
    });
    return res.status(400).json({
      message: 'Request OTPs again.'
    });
  }

  if (tempUser.failedAttempts > MAX_ATTEMPTS) {
    return res.status(403).json({
      message: 'Too many incorrect attempts. Please register again.'
    });
  }

  if (tempUser.mobileOtp !== mobileOtp || tempUser.emailOtp !== emailOtp) {
    tempUser.failedAttempts+=1;
    await tempUser.save();
    return res.status(400).json({ message:
      'Incorrect OTP. Please try again.'
    });
  }

  const existingUser = await User.findOne({
    mobile
  });

  if(existingUser){
    return res.json({
      message: "User already exists"
    })
  }

  const newUser = await User.create({
    name: tempUser.name,
    password: tempUser.password,
    mobile: tempUser.mobile,
    email: tempUser.email,
    mobileVerified: true,
    emailVerified: true,
  });

  await TempUser.deleteOne({
    mobile,
  });

  res.status(200).json({
    message: 'User verified and registered successfully.'
  });
};



export const resendOtp = async (req, res) => {
  try {
    const {mobile, email} = req.body; 

    const tempUser = await TempUser.findOne({ mobile, email });

    if (!tempUser) {
      return res.status(400).json({
        message: 'Please register again.'
      });
    }

    // const timeSinceLastOtp = Date.now() - new Date(tempUser.otpExpiry).getTime()  - 5*60*1000;
    
    // if (timeSinceLastOtp < 60*1000) {
    //   return res.status(429).json({
    //     message: 'Please wait before requesting a new OTP.'
    //   });
    // }

    const newMobileOtp = crypto.randomInt(100000, 999999).toString();
    const newEmailOtp = crypto.randomInt(100000, 999999).toString();
    const newOtpExpiry = new Date(Date.now() + 5*60*1000);

    tempUser.mobileOtp = newMobileOtp;
    tempUser.emailOtp = newEmailOtp;
    tempUser.otpExpiry = newOtpExpiry;

    await tempUser.save();

    try {
      await sendOtpEmail(email, newEmailOtp);
      await sendOtpSms(mobile, newMobileOtp);
    } catch (error) {
      await TempUser.deleteOne({ mobile, email });
      return res.status(500).json({
        message: 'Failed to send OTP. Please try again.',
        error: error.message
      });
    }

    res.status(200).json({
      message: 'New OTPs sent to mobile and email.'
    });
  } catch (error) {
    return res.status(400).json({
      message: error
    });
  }
};


