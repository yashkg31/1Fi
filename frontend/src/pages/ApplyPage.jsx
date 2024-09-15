import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userState } from '../Atom/atom';
import { RiMailSendLine } from "react-icons/ri";

const ApplyPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const setUser = useSetRecoilState(userState); 

  const navigate = useNavigate();

  const validate = () => {
    const { name, mobile, email, password } = formData;

    if (name.length < 3 || name.length > 18) {
      setError('Name should be between 3 to 18 characters');
      return false;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setError('Mobile number should be exactly 10 digits');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6 || password.length > 12) {
      setError('Password should be between 6 to 12 characters');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await axios.post('/api/v1/register', formData);
      setMessage(response.data.message);
      setLoading(false);
      setUser(formData);
      navigate('/verify-otp');

    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-lg mx-auto p-8 shadow-lg shadow-zinc-600 border-2 bg-white mt-20 rounded-md">
      <h2 className="text-3xl font-bold text-center mb-6">Apply Here</h2>
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full text-xl font-bold bg-green-500 text-white p-3 border-2 rounded-xl mt-4 hover:border-black hover:border-2 hover:text-black"
        >
          {loading ? (<p>Sending...</p>) : (<div className=' flex justify-center items-center gap-5'>
            <p>Request OTP</p>
            <RiMailSendLine />
          </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default ApplyPage;
