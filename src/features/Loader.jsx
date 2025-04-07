import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { selectStatus } from "./auth/authSlice";
import { useSelector } from "react-redux";
import { selectStatus2 } from "./dashboard/components/customer/customerSlice";

const Loader = () => {
    const status1 = useSelector(selectStatus);
    const status2 = useSelector(selectStatus2);

    const status = (status1) ? status1 : status2;

    if (status != "loading") {
        return null;
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-transparent p-6 rounded-2xl shadow-xl flex flex-col items-center"
      >
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        {/* <p className="mt-3 text-lg font-semibold text-white">Loading...</p> */}
      </motion.div>
    </div>
  );
};

export default Loader;
