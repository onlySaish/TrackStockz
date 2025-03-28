import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SalesChart = ({ salesData }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                    <XAxis dataKey="month" tick={{ fill: '#4B5563' }} />
                    <YAxis tick={{ fill: '#4B5563' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;