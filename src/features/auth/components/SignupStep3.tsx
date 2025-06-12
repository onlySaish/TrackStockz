import React, { useState } from "react";
import { createUserAsync, showPopup } from "../authSlice";
import { Navigate } from "react-router";
import type { createUserData } from "../authTypes";
import { useAppDispatch } from "../../../hooks";

interface SignupStep3Props {
    userData: Partial<createUserData>;
}

interface FormState {
  fullName: string;
  username: string;
  avatar: File | null;
}

const SignupStep3: React.FC<SignupStep3Props> = ({ userData }) => {
  const [form, setForm] = useState<FormState>({ fullName: "", username: "", avatar: null });
  const [avatarPreview, setAvatarPreview] = useState<string>(
    "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
  );
  const dispatch = useAppDispatch();
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...userData, ...form };
    if (!finalData.email || !finalData.password) {
      dispatch(
        showPopup({
          message: "Email and password are required.",
          duration: 3000,
          type: "error",
        })
      );
      return;
    }
    const res = await dispatch(createUserAsync(finalData as createUserData));
    if (res.meta.requestStatus === "fulfilled") {
      setSignupSuccess(true);
    }
  };

  if (signupSuccess) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className="h-2/3 w-11/12 md:w-8/12 lg:w-3/6 xl:w-2/6 bg-gray-800/50 flex flex-col justify-center items-center rounded-md px-6 py-4">
      <form
        onSubmit={handleSubmit}
        className="h-full w-full flex flex-col justify-evenly items-center"
      > 
        <div className="text-white text-xl font-bold md:text-4xl lg:text-3xl lg:mt-2">
          CREATE ACCOUNT
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <img
            src={avatarPreview}
            alt="Profile Avatar"
            className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg transition-transform duration-300 hover:scale-110"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            id="avatarUpload"
          />
          <label
            htmlFor="avatarUpload"
            className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-all duration-300 active:scale-95"
          >
            Choose Image
          </label>
        </div>

        <div className="w-full px-4 py-2 font-medium">
          <div className="text-white text-sm md:text-xl">Enter Full Name</div>
          <input
            className="w-full mt-2 h-10 text-sm pl-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 shadow-md"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            type="text"
            placeholder="Full Name"
          />
        </div>

        <div className="w-full px-4 py-2 font-medium">
          <div className="text-white text-sm md:text-xl">Enter Username</div>
          <input
            className="w-full mt-2 h-10 text-sm pl-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-600 shadow-md"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            type="text"
            placeholder="Username"
          />
        </div>

        <button
          className="w-full max-w-[220px] text-white text-lg font-medium bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-md py-2 rounded-lg active:scale-95 mt-4"
        >
          Complete Signup
        </button>
      </form>
    </div>
  );
}

export default SignupStep3;
