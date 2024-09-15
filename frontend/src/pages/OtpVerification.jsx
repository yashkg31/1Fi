import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../Atom/atom'; // Import the Recoil atom

const OtpVerification = () => {
  const [otp, setOtp] = useState({
    mobileOtp: '',
    emailOtp: ''
  });
  
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(true);
  const [message, setMessage] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0 && timerActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      setMessage("You can request a new OTP");
    }
    return () => clearInterval(interval);
  }, [timer, timerActive]);

  const handleChange = (e) => {
    setOtp({
      ...otp,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    try {
      const response = await axios.post('/api/v1/verify-otp', {
        mobileOtp: otp.mobileOtp,
        emailOtp: otp.emailOtp,
        mobile: user.mobile,
        email: user.email
      });
      setVerifyLoading(false);
      setMessage("Verification successful.");
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      setMessage(`Error: ${error?.response?.data?.message}`);
      setVerifyLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setResendLoading(true);
    try {
      const response = await axios.post('/api/v1/resend-otp', {
        mobile: user.mobile,
        email: user.email
      });
      
      setResendLoading(false);
      setMessage("OTP resent successfully.");
      setTimer(60);
      setTimerActive(true);
    } catch (error) {
      console.log(error);
      setMessage(`Error: ${error?.response?.data?.message}`);
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 shadow-lg shadow-zinc-600 border-2 bg-white mt-20 rounded-md">
      <h2 className="text-3xl font-bold text-center mb-6">Verify OTP</h2>
      
      {message && <p className="text-blue-800 text-center mb-4">{message}</p>}
      
      {timerActive && (
        <p className="text-green-700 text-center mb-4">Please wait for {timer} seconds before sending a new OTP.</p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="mobileOtp"
          placeholder="Enter Mobile OTP"
          value={otp.mobileOtp}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="emailOtp"
          placeholder="Enter Email OTP"
          value={otp.emailOtp}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <div className='flex space-x-3'>
          <button
            type="submit"
            className="w-full text-md font-bold bg-green-500 text-white p-3 border-2 rounded-xl mt-4 hover:border-black hover:border-2 hover:text-black"
          >
            {verifyLoading ? (<p>Verifying...</p>) : <p>Verify OTP</p>}
          </button>
          <button
            onClick={handleResend}
            className="w-full text-md font-bold bg-green-500 text-white p-3 border-2 rounded-xl mt-4 hover:border-black hover:border-2 hover:text-black"
            disabled={timer > 0}
          >
            {resendLoading ? (<p>Sending...</p>) : <p>Resend OTP</p>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;
