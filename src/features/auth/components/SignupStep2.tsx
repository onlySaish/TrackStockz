import React, { useRef, useState } from "react";
import { sendOtpAsync, verifyOtpAsync } from "../authSlice";
import { useAppDispatch } from "../../../hooks";
import type { createUserData } from "../authTypes";

interface SignupStep2Props {
    nextStep: () => void;
    userData: Partial<createUserData>;
}

const SignupStep2: React.FC<SignupStep2Props> = ({ nextStep, userData }) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move cursor to the rightmost position
      setTimeout(() => {
        e.target.setSelectionRange(1, 1);
      }, 0);

      // Move to next input if not empty
      if (value !== "" && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join("");
    const response = await dispatch(
      verifyOtpAsync({ email: userData.email!, otp: otpCode })
    );
    if (response.meta.requestStatus === "fulfilled") {
      nextStep();
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setTimer(30); // Reset timer
    await dispatch(
      sendOtpAsync({ email: userData.email!, password: userData.password! })
    ); // Send email & password

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
    <div className="h-2/3 w-11/12 md:w-1/2 lg:w-2/5 xl:w-1/4 bg-gray-800/75 flex flex-col justify-center items-center rounded-md px-6 py-4">
      <form
        onSubmit={handleVerify}
        className="h-full w-full flex flex-col justify-evenly items-center"
      >
        <div className="text-white text-xl font-bold md:text-4xl lg:text-3xl lg:mt-2">
          CREATE ACCOUNT
        </div>
        <div className="w-full px-4 py-1 font-medium text-center">
          <div className="text-white text-sm md:text-xl mb-2">Enter OTP</div>
          <div className="grid grid-cols-4 gap-3 justify-center mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-md outline-none focus:border-blue-600 shadow-md"
              />
            ))}
          </div>
        </div>

        {/* Material Styled Buttons */}
        <button
          className="w-full max-w-[220px] text-white text-lg font-medium bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-md py-2 rounded-lg active:scale-95"
        >
          Verify OTP
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendDisabled}
          className={`mt-3 text-white text-sm font-medium py-3 px-5 rounded-lg w-full max-w-[220px] shadow-md transition-all duration-300 active:scale-95 ${
            resendDisabled
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-900"
          }`}
        >
          {resendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
        </button>
      </form>
    </div>
  );
}

export default SignupStep2;
