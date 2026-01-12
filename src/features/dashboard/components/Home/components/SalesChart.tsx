import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { SalesTrend } from "../../../dashboardTypes";

const SalesChart = ({ salesData }: { salesData: SalesTrend[] }) => {
    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold text-white mb-4">Sales Overview</h2>
            <div className="w-full overflow-x-auto pb-2">
                <div className="min-w-[500px] h-[250px] md:h-[300px] md:min-w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="month"
                                tick={{ fill: '#4B5563', fontSize: 12 }}
                                tickMargin={10}
                            />
                            <YAxis
                                tick={{ fill: '#4B5563', fontSize: 12 }}
                                tickFormatter={(value) => Number(value).toFixed(2)}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow-lg">
                                                <p className="text-white text-sm font-semibold mb-1">{label}</p>
                                                <p className="text-blue-400 text-sm">
                                                    Revenue: {Number(payload[0].value).toFixed(2)}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="revenue" barSize={20} fill="#1d5dab" radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
