import React, { useEffect, useRef, useState } from 'react'
import { setProfileActiveContent, updatePassword } from '../profileSlice';
import { useDispatch } from 'react-redux';
import { showPopup } from '../../../../auth/authSlice';

function ChangePassword() {
    const dispatch = useDispatch();
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [isPassSame, setIsPassSame] = useState(false);
    

    const currpassref = useRef(null);
    const toogleCurrPassVisibility = (eyeIcon) => {
      if (currpassref.current.type === "password"){
        eyeIcon.classList.remove("fa-eye-slash")
        eyeIcon.classList.add("fa-eye")
        currpassref.current.type = "text"
      } else {
        currpassref.current.type = "password"
        eyeIcon.classList.remove("fa-eye")
        eyeIcon.classList.add("fa-eye-slash")
      }
    }

    const newpassref = useRef(null);
    const toogleNewPassVisibility = (eyeIcon) => {
      if (newpassref.current.type === "password"){
        eyeIcon.classList.remove("fa-eye-slash")
        eyeIcon.classList.add("fa-eye")
        newpassref.current.type = "text"
      } else {
        newpassref.current.type = "password"
        eyeIcon.classList.remove("fa-eye")
        eyeIcon.classList.add("fa-eye-slash")
      }
    }
      
    const confirmPassRef = useRef(null)
    const toogleConfirmPassVisibility = (eyeIcon) => {
        if (confirmPassRef.current.type === "password"){
            eyeIcon.classList.remove("fa-eye-slash")
            eyeIcon.classList.add("fa-eye")
            confirmPassRef.current.type = "text"
        } else {
            confirmPassRef.current.type = "password"
            eyeIcon.classList.remove("fa-eye")
            eyeIcon.classList.add("fa-eye-slash")
        }
    }

    const isPassSameChecker = () => {
      if (newPass == confirmPass){
        setIsPassSame(true);
      } else {
        setIsPassSame(false);
      }
    }
    
    useEffect(() => {
      isPassSameChecker();
    },[confirmPass])

    const handleSave = async(e) => {
      e.preventDefault();
      if (!isPassSame) {
        dispatch(
          showPopup({
            message: "Passwords do not match!",
            duration: 3000,
            type: "error",
          })
        );
        return;
      }

      if (currentPass === newPass) {
        dispatch(
          showPopup({
            message: "New Password Should Not be Similar to Old Password!",
            duration: 3000,
            type: "error",
          })
        );
        return;
      }
      dispatch(updatePassword({oldPassword : currentPass, newPassword : newPass}))
    }

    const handleCancel = () => {
      dispatch(setProfileActiveContent("Profile"));
    };

  return (
    <div className="relative p-6 rounded-2xl border-2 bg-white shadow-2xl max-w-xl mx-auto transition-transform duration-300 hover:scale-105 z-10">
      
      <div className="relative bg-white rounded-2xl p-6">
          <div className="flex flex-col">

            <div className="flex flex-col mb-4 relative">
              <label htmlFor="currentPass" className="text-lg font-semibold text-gray-700 mb-1 ml-2">Current Password</label>
              <input
                type="password"
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Enter your Current Password"
                className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full max-w-lg"
                id="currentPass"
                ref={currpassref}
              />
              <div 
                onClick={(e) => toogleCurrPassVisibility(e.target)}
                className="hover:cursor-pointer fa-solid fa-eye-slash inline-block absolute right-3 top-3 md:top-4 text-xl md:text-3xl lg:text-2xl lg:top-10 text-gray-700">
              </div>
            </div>

            <div className="flex flex-col mb-4 relative">
              <label htmlFor="newPass" className="text-lg font-semibold text-gray-700 mb-1 ml-2">New Password</label>
              <input
                type="password"
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter your New Password"
                className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full max-w-lg"
                id='newPass'
                ref={newpassref}
              />
              <div 
                onClick={(e) => toogleNewPassVisibility(e.target)}
                className="hover:cursor-pointer fa-solid fa-eye-slash inline-block absolute right-3 top-3 md:top-4 text-xl md:text-3xl lg:text-2xl lg:top-10 text-gray-700">
              </div>
            </div>

            <div className="flex flex-col mb-4 relative">
              <label htmlFor="confirmPass" className="text-lg font-semibold text-gray-700 mb-1 ml-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPass"
                ref={confirmPassRef}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm Password here"
                className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full max-w-lg" 
              />
              <div 
                onClick={(e) => toogleConfirmPassVisibility(e.target)}
                className="hover:cursor-pointer fa-solid fa-eye-slash inline-block absolute right-3 top-3 md:top-4 text-xl md:text-3xl lg:text-2xl lg:top-10 text-gray-700">
              </div>
            </div>

            <div className="mt-5 flex gap-8">
              <button
                onClick={handleSave}
                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-5 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default ChangePassword