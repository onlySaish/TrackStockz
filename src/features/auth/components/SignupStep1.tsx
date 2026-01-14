import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router';
import { googleAuthAsync, selectLoggedInUser, sendOtpAsync, showPopup } from '../authSlice';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { useAppDispatch, useAppSelector } from '../../../hooks';

interface SignupStep1Props {
  nextStep: (data: { email: string; password: string }) => void;
}

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupStep1: React.FC<SignupStep1Props> = ({ nextStep }) => {
  const [form, setForm] = useState<FormState>({ email: "", password: "", confirmPassword: "" });
  const [isPassSame, setIsPassSame] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectLoggedInUser);


  const isPassSameChecker = () => {
    setIsPassSame(form.password === form.confirmPassword);
  }

  useEffect(() => {
    isPassSameChecker();
  }, [form.password, form.confirmPassword])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const response = await dispatch(sendOtpAsync({ email: form.email, password: form.password }));
    if (response.meta.requestStatus === "fulfilled") {
      nextStep({
        email: form.email,
        password: form.password
      });
    }
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
      <div className="h-fit w-11/12 md:w-8/12 lg:w-3/6 xl:w-2/6 bg-gray-800/75 flex flex-col justify-center items-center rounded-md p-8 shadow-lg backdrop-blur-md">
        <h2 className="text-white text-center text-3xl font-extrabold mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4 mb-4">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              className="peer w-full bg-gray-900 text-white px-4 pt-5 pb-2 rounded-md outline-none border border-gray-600 focus:border-blue-500"
              placeholder=" "
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
              Enter Email
            </label>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="peer w-full bg-gray-900 text-white px-4 pt-5 pb-2 rounded-md outline-none border border-gray-600 focus:border-blue-500"
              placeholder=" "
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
              Enter Password
            </label>
            <span
              className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </span>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`peer w-full bg-gray-900 text-white px-4 pt-5 pb-2 rounded-md outline-none border ${form.confirmPassword && form.password
                ? isPassSame
                  ? "border-green-400"
                  : "border-red-600"
                : "border-gray-600"
                } focus:border-blue-500`}
              placeholder=" "
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
              Confirm Password
            </label>
            <span
              className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-200"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={`fa-solid ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-bold py-3 rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
          >
            Submit
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
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default SignupStep1