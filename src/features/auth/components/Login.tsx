import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { googleAuthAsync, loginUserAsync, selectLoggedInUser } from "../authSlice";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { useAppDispatch, useAppSelector } from "../../../hooks.js";

function Login() {
  const [identity, setIdentity] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectLoggedInUser);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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


  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(googleAuthAsync(tokenResponse.code));
    },
    onError: () => {
      alert('Google login failed');
    },
    flow: 'auth-code',
  });

  if (user) return <Navigate to="/" replace />;

  return (
    <>
      <div className="relative min-h-screen flex flex-col gap-3 items-center justify-center bg-gray-900 px-4">
        <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-md shadow-lg rounded-lg p-8">

          <h2 className="text-white text-center text-3xl font-extrabold mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 mb-4">
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
                type={showPassword ? "text" : "password"}
                id="password"
                className="peer w-full bg-gray-900 text-white px-4 pt-5 pb-2 rounded-md outline-none border border-gray-600 focus:border-blue-500"
                placeholder=" "
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
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
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

          <button
            onClick={() => handleGoogleLogin()}
            className="flex items-center gap-3 bg-white text-black mx-auto px-6 py-3 rounded-xl shadow hover:shadow-md border border-gray-300 transition-all duration-300"
          >
            <FcGoogle size={24} />
            <span className="text-sm font-medium">Continue with Google</span>
          </button>

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
