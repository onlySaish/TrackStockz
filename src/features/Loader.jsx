import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { selectStatus } from "./auth/authSlice";
import { useSelector } from "react-redux";

const Loader = () => {
    const status = useSelector(selectStatus);
    if (status != "loading") {
        return null;
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center"
      >
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-lg font-semibold text-gray-700">Loading...</p>
      </motion.div>
    </div>
  );
};

export default Loader;
