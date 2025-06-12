import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { SalesTrend } from "../../../dashboardTypes";

const SalesChart = ({ salesData }: {salesData:SalesTrend[]}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-white mb-4">Sales Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={salesData}>
                    <XAxis dataKey="month" tick={{ fill: '#4B5563' }} />
                    <YAxis tick={{ fill: '#4B5563' }} />
                    <Tooltip />
                    <Bar dataKey="revenue" barSize={30} fill="#1d5dab" />
                    <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
