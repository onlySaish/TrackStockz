// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { profileSelector, sendOtpAsync, setProfileActiveContent, showPopup2, verifyOtpAsync} from '../profileSlice.js';
// import axios from 'axios';

// function ChangeNumber() {
//   const dispatch = useDispatch();
//   const user = useSelector(profileSelector);
//   const [phone, setPhone] = useState(user.phoneNumber || "");
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [resendDisabled, setResendDisabled] = useState(false);
//   const [timer, setTimer] = useState(30);

//   const handleSendOtp = async () => {
//     if (!phone && !(phone.length() == 10)) {
//       dispatch(
//           showPopup({
//             message: "Please enter a valid phone number.",
//             duration: 3000,
//             type: "error",
//          })
//       );
//       return;
//     }

//     await dispatch(sendOtpAsync({phoneNumber:phone}));
//     setIsOtpSent(true);
//     setResendDisabled(true);
//     setTimer(30);

//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev === 1) {
//           clearInterval(interval);
//           setResendDisabled(false);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const handleSave = async () => {
//     if (!otp) {
//       dispatch(
//         showPopup2({
//           message: "Please enter the OTP.",
//           duration: 3000,
//           type: "error",
//        })
//     );
//       return;
//     }

//     dispatch(verifyOtpAsync({ phoneNumber:phone, otp:otp }));
//   };

//   const handleCancel = () => {
//     dispatch(setProfileActiveContent("EditProfile"));
//   };

//   return (
//     <div className="relative p-6 rounded-2xl border-2 bg-white shadow-2xl max-w-xl mx-auto">
//       <div className="relative bg-white rounded-2xl p-6">
//         <div className="flex flex-col">
//           <div className="flex flex-col mb-4">
//             <label htmlFor="phone" className="text-lg font-semibold text-gray-700 mb-1 ml-2">Phone Number</label>
//             <input
//               type="text"
//               name="phone"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder='Enter Phone Number'
//               className={`border-2 p-3 rounded-lg w-full max-w-lg ${(isOtpSent) ? "cursor-not-allowed bg-gray-200" : ""}`}
//               disabled={isOtpSent}
//             />
//           </div>

//           <div className="flex flex-col mb-4 relative">
//             <label htmlFor="otp" className="text-lg font-semibold text-gray-700 mb-1 ml-2">OTP</label>
//             <input
//               type="text"
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               className={`border-2 p-3 rounded-lg w-full max-w-lg ${(!isOtpSent) ? "cursor-not-allowed bg-gray-200" : ""}`}
//               disabled={!isOtpSent}
//             />
//           </div>

//           <div className="mt-5 flex gap-8">
//             <button
//               onClick={handleSave}
//               className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
//               disabled={!isOtpSent}
//             >
//               Submit
//             </button>
//             <button
//               onClick={handleCancel}
//               className="px-5 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSendOtp}
//               disabled={resendDisabled}
//               className={`ml-20 px-5 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl
//                 ${resendDisabled ? "bg-gray-500 cursor-not-allowed" : ""}`}
//             >
//               {isOtpSent ? (resendDisabled ? `Resend in ${timer}s` : "Resend OTP") : "Send OTP"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChangeNumber;
