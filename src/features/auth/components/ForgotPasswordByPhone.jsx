// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { setForgotPassActive, forgotPasswordAsync, showPopup } from '../authSlice';
// import { Link } from 'react-router-dom';

// function ForgotPasswordByPhone() {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [resendDisabled, setResendDisabled] = useState(false);
//   const [timer, setTimer] = useState(30);
  
//   const dispatch = useDispatch();
//   const toggleActive = () => {
//     dispatch(setForgotPassActive("Email"));
//   };

//   const handleSendOtp = async () => {
//     const trimmedPhone = phone.trim();

//     // Validate phone number (10 digits only)
//     if (!/^\d{10}$/.test(trimmedPhone)) {
//       dispatch(
//         showPopup({
//           message: "Please enter a valid 10-digit phone number.",
//           duration: 3000,
//           type: "error",
//         })
//       );
//       return;
//     }

//     await dispatch(sendPhoneOtpAsync({ phoneNumber: trimmedPhone }));
//     setIsOtpSent(true);
//     setResendDisabled(true);
//     setTimer(30);
//   };

//   // Handle Timer Countdown
//   useEffect(() => {
//     if (resendDisabled && timer > 0) {
//       const interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);

//       return () => clearInterval(interval);
//     } else {
//       setResendDisabled(false);
//     }
//   }, [resendDisabled, timer]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!isOtpSent) {
//       dispatch(showPopup({ message: "Please request an OTP first.", duration: 3000, type: "error" }));
//       return;
//     }
//     dispatch(verifyPhoneOtpAsync({phone: phone, otp: otp}));
//   };

//   return (
//     <div className="h-fit w-3/4 lg:w-1/3 bg-black/75 flex flex-col justify-center items-center rounded-3xl p-6">
//       <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-6">
//         <h2 className="text-white text-3xl md:text-4xl font-bold">FORGOT PASSWORD</h2>

//         {/* Phone Input */}
//         <div className="w-11/12 px-4">
//           <label className="text-white text-lg md:text-xl block mb-2">Enter Registered Phone Number</label>
//           <input
//             className="w-full h-12 text-lg pl-3 rounded-3xl text-black/80 md:text-2xl"
//             onChange={(e) => setPhone(e.target.value)}
//             type="text"
//             placeholder="Enter Here"
//             maxLength="10"
//           />
//         </div>

//         {/* Send OTP Button */}
//         <button
//           type="button"
//           onClick={handleSendOtp}
//           disabled={resendDisabled}
//           className={`px-5 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl 
//             ${resendDisabled ? "bg-gray-500 cursor-not-allowed" : ""}`}
//         >
//           {isOtpSent ? (resendDisabled ? `Resend in ${timer}s` : "Resend OTP") : "Send OTP"}
//         </button>

//         {/* Toggle to Email */}
//         <div onClick={toggleActive} className="text-right w-full text-md md:text-xl text-blue-500 cursor-pointer hover:underline">
//           Use Email Instead?
//         </div>

//         {/* OTP Input */}
//         <div className="w-11/12 px-4">
//           <label className="text-lg font-semibold text-white mb-1 block">OTP</label>
//           <input
//             type="text"
//             onChange={(e) => setOtp(e.target.value)}
//             placeholder="Enter OTP"
//             className={`border-2 p-3 rounded-lg w-full text-lg md:text-xl ${!isOtpSent ? "cursor-not-allowed bg-gray-200" : ""}`}
//             disabled={!isOtpSent}
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-2/4 lg:w-2/3 text-2xl font-bold bg-orange-500 text-white px-4 py-2 rounded-3xl transition-transform hover:scale-105"
//         >
//           Reset Password
//         </button>
//       </form>

//       {/* Return to Login */}
//       <div className="text-white text-md md:text-xl mt-4">
//         <Link to="/login" className="text-blue-500 hover:underline">Return to Login?</Link>
//       </div>
//     </div>
//   );
// }

// export default ForgotPasswordByPhone;
