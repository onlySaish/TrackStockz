import React, { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUserAsync, selectLoggedInUser } from "../authSlice.js";

function Login() {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const passRef = useRef(null);

  const togglePassVisibility = (eyeIcon) => {
    if (passRef.current.type === "password") {
      eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
      passRef.current.type = "text";
    } else {
      eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
      passRef.current.type = "password";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmail = identity.includes("@");

    const formData = new FormData();
    if (isEmail) {
      formData.append("email", identity);
    } else {
      formData.append("username", identity);
    }
    formData.append("password", password);

    dispatch(loginUserAsync(formData));
  };

  return (
    <>
      {user && <Navigate to="/" replace={true} />}

      <div className="relative min-h-screen flex flex-col gap-3 items-center justify-center bg-gray-900 px-4">
        <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-md shadow-lg rounded-lg p-8">
          
          <h2 className="text-white text-center text-3xl font-extrabold mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identity Input */}
            <div className="relative">
              <input
                type="text"
                id="identity"
                className="peer w-full bg-gray-900 text-white px-4 pt-5 pb-2 rounded-md outline-none border border-gray-600 focus:border-blue-500"
                placeholder=" "
                onChange={(e) => setIdentity(e.target.value)}
              />
              <label
                htmlFor="identity"
                className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400"
              >
                Email or Username
              </label>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                id="password"
                className="peer w-full bg-gray-900 text-white px-4 pt-5 pb-2 rounded-md outline-none border border-gray-600 focus:border-blue-500"
                placeholder=" "
                ref={passRef}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400"
              >
                Password 
              </label>
              <span
                className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-200"
                onClick={(e) => togglePassVisibility(e.target)}
              >
                <i className="fa-solid fa-eye-slash"></i>
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-bold py-3 rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
            >
              Login
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 text-gray-400">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:underline">
                Sign Up
              </Link>
            </p>
            <p className="text-sm mt-2">
              <Link to="/forgotpassword" className="text-blue-400 hover:underline">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
