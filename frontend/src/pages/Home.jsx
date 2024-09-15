import React from 'react';
import { Link } from 'react-router-dom';
import { CiMemoPad } from "react-icons/ci";
import { FaRupeeSign } from "react-icons/fa";
import { GiShakingHands } from "react-icons/gi";

const Home = () => {
  return (
    <>
      <div className="flex justify-around items-center bg-white shadow-lg fixed w-full">
        <div className="h-full">
          <img src="1Fi_White_PNG-removebg-preview.png" alt="1Fi Logo" className="w-16" />
        </div>

        <ul className="flex gap-8 text-lg font-bold">
          <li className="cursor-pointer hover:text-blue-600">HOME</li>
          <li className="cursor-pointer hover:text-blue-600">WHY 1FI</li>
          <li className="cursor-pointer hover:text-blue-600">HOW IT WORKS</li>
          <li className="cursor-pointer hover:text-blue-600">FAQ</li>
          <li className="cursor-pointer hover:text-blue-600">Connect with us</li>
        </ul>
        <div>
          <button className="flex items-center text-md gap-4 bg-green-500 text-white px-8 py-3 rounded-3xl">
            <CiMemoPad />
            <Link to="/apply" className="text-white font-bold mt-0.5">APPLY NOW</Link>
          </button>
        </div>
      </div>

      <div className="text-center p-10 pt-24 block md:flex">
        <div className='text-left space-y-4'>
            <h3 className="text-3xl mt-4">With 1<b>Fi</b> you can</h3>
            <h1 className="text-6xl font-bold text-blue-700">SUPERCHARGE YOUR INVESTMENTS</h1>
            <h3 className="text-3xl mt-4">With Loan Against Securities</h3>

            <div className="text-lg mt-4 space-x-8 flex items-center">
                <FaRupeeSign className='h-12' />
                <p><b>INVEST</b> in mutual funds that generate 15-30% annual returns in the long term.</p>
            </div>
            <div className="text-lg mt-4 space-x-8 flex items-center">
                <GiShakingHands className='h-12' />
                <p><b>BORROW</b> cash instantly whenever you need at just 8% per annum.</p>
            </div>

            <button className="flex items-center text-lg gap-4 bg-green-500 text-white px-8 py-3 rounded-3xl">
                <CiMemoPad />
                <Link to="/apply" className="text-white font-bold mt-0.5">APPLY NOW</Link>
          </button>
        </div>

        <img src='4.-Design-1.png' className='h-[80vh] p-3'></img>
      </div>
    </>
  );
};

export default Home;

