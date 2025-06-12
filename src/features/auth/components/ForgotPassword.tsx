import React, { useState} from "react";
import { forgotPasswordAsync } from "../authSlice";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../hooks";

function ForgotPasswordByEmail() {
  const [email, setEmail] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(forgotPasswordAsync(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-md shadow-xl rounded-md p-8">
        
        <h2 className="text-white text-center text-3xl font-extrabold mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              id="email"
              className="peer w-full bg-gray-900 text-white px-4 pt-5 pb-2 rounded-md outline-none border border-gray-600 focus:border-blue-500"
              placeholder=" "
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400"
            >
              Enter Registered Email
            </label>
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white text-lg font-semibold py-3 rounded-md shadow-md transition-all duration-300 hover:bg-indigo-600 hover:shadow-lg hover:scale-[1.02] active:scale-95"
          >
            Reset Password
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-6 text-gray-400">
          <p className="text-sm">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Return to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordByEmail;
