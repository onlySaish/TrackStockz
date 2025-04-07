import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { resetPasswordAsync, showPopup, verifyTokenAsync } from "../authSlice";
import { useNavigate, useParams } from "react-router";

function ResetPassword() {
  const dispatch = useDispatch();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPassSame, setIsPassSame] = useState(false);
  const navigate = useNavigate();
  
  const passref = useRef(null);
  const confirmPassRef = useRef(null);

  const toggleVisibility = (inputRef, eyeIcon) => {
    if (inputRef.current.type === "password") {
      eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
      inputRef.current.type = "text";
    } else {
      eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
      inputRef.current.type = "password";
    }
  };

  useEffect(() => {
    setIsPassSame(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        const res = await dispatch(verifyTokenAsync(token));
        if (res.meta.requestStatus !== "fulfilled") navigate("/login");
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPassSame) {
      dispatch(showPopup({ message: "Passwords do not match!", duration: 3000, type: "error" }));
      return;
    }

    const res = await dispatch(resetPasswordAsync({ token, newPassword: password }));
    if (res.meta.requestStatus === "fulfilled") navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-md shadow-xl rounded-md p-8">
        
        <h2 className="text-white text-center text-3xl font-extrabold mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              id="pass"
              ref={passref}
              className="peer w-full bg-gray-900 text-white px-4 pt-5 pb-2 rounded-md outline-none border border-gray-600 focus:border-blue-500"
              placeholder=" "
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="pass"
              className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400"
            >
              Enter Password
            </label>
            <div
              onClick={(e) => toggleVisibility(passref, e.target)}
              className="absolute right-4 top-3 text-gray-500 hover:cursor-pointer fa-solid fa-eye-slash text-lg"
            ></div>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type="password"
              id="confirm-pass"
              ref={confirmPassRef}
              className={`peer w-full bg-gray-900 text-white px-4 pt-5 pb-2 rounded-md outline-none border ${confirmPassword && password ? (isPassSame ? "border-green-400" : "border-red-500") : "border-gray-600"} focus:border-blue-500`}
              placeholder=" "
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label
              htmlFor="confirm-pass"
              className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400"
            >
              Confirm Password
            </label>
            <div
              onClick={(e) => toggleVisibility(confirmPassRef, e.target)}
              className="absolute right-4 top-3 text-gray-500 hover:cursor-pointer fa-solid fa-eye-slash text-lg"
            ></div>
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white text-lg font-semibold py-3 rounded-md shadow-md transition-all duration-300 hover:bg-indigo-600 hover:shadow-lg hover:scale-[1.02] active:scale-95"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
