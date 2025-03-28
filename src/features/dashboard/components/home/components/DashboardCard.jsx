import React from "react";

const DashboardCard = ({ title, value }) => {
    return (
        <div className="bg-white p-6 shadow-lg rounded-lg text-center border border-gray-200 hover:shadow-xl transition">
            <h2 className="text-lg font-medium text-gray-600">{title}</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
    );
};

export default DashboardCard;