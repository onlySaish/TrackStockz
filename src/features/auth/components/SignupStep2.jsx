import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { sendOtpAsync, verifyOtpAsync } from '../authSlice';

function SignupStep2({ nextStep, userData }) {
    const [otp, setOtp] = useState("");
    const [resendDisabled, setResendDisabled] = useState(false);
    const [timer, setTimer] = useState(30);
    const dispatch = useDispatch();

    const handleVerify = async (e) => {
        e.preventDefault();
        const response = await dispatch(verifyOtpAsync({ email: userData.email, otp }));
        if (response.meta.requestStatus === "fulfilled") {
          nextStep();
        }
      };

      const handleResendOtp = async () => {
        setResendDisabled(true);
        setTimer(30); // Reset timer
        await dispatch(sendOtpAsync({ email: userData.email, password: userData.password })); // Send email & password
    
        // Countdown Timer
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev === 1) {
              clearInterval(interval);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      };

  return (
    <div className='h-2/3 w-3/4 bg-black/75 flex flex-col justify-center items-center rounded-3xl lg:w-1/4'>
    <form onSubmit={handleVerify}
    className='h-full w-full flex flex-col justify-evenly items-center'>
    <div className='text-white text-xl font-bold md:text-4xl lg:text-3xl lg:mt-2'>CREATE ACCOUNT</div>
      <div className='w-11/12 px-4 py-1 font-medium'>
        <div className='text-white text-sm px-3 md:text-xl'>Enter OTP</div>
            <input 
                className='w-full mt-2 h-8 text-sm pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                onChange={(e) => setOtp(e.target.value)}
                type="text" 
                placeholder='OTP'
                required/>
        </div>
        <button className='h-auto text-white w-2/4 text-lg font-bold bg-orange-500 mt-2 px-2 py-1 md:py-2 rounded-3xl md:text-3xl md:mt-4 lg:text-2xl lg:py-1 lg:w-1/2'>
            Verify OTP
        </button>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendDisabled}
          className={`mt-3 text-white text-sm font-bold py-1 px-4 rounded-3xl md:text-xl lg:text-lg ${
            resendDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
          }`}
        >
          {resendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
        </button>
    </form>
    </div>
  )
}

export default SignupStep2