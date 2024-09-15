import mongoose from 'mongoose';

const tempUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 18,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    maxLength: 12,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 10,
    maxLength: 10,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  mobileOtp: {
    type: String,
    required: true,
  },
  emailOtp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
    index: {expires: "10m"}
  },
  failedAttempts: {
    type: Number,
    default: 0,
  }
});

const TempUser = mongoose.model('TempUser', tempUserSchema);

export default TempUser;
