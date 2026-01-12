import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { CustomerTrend } from "../../../dashboardTypes";

const CustomersChart = ({ customerData }: { customerData: CustomerTrend[] }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-white mb-4">New Customers Overview</h2>
      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-[500px] h-[250px] md:h-[300px] md:min-w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={customerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                tick={{ fill: '#4B5563', fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow-lg">
                        <p className="text-white text-sm font-semibold mb-1">{label}</p>
                        <p className="text-green-400 text-sm">
                          New Customers: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" barSize={20} fill="#059669" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CustomersChart;
