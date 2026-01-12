import type { RecentOrder } from "../../../dashboardTypes";

const RecentOrdersTable = ({ orders }: { orders: RecentOrder[] }) => {
    return (
        <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 text-white rounded-sm min-w-[600px] md:min-w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-start">Order ID</th>
                            <th className="px-4 py-2">Customer</th>
                            <th className="px-4 py-2">Total</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer text-center">
                                <td className="p-3 text-start">{order.id}</td>
                                <td className="capitalize p-3">{order.customer}</td>
                                <td className="p-3">{order.totalPrice}</td>
                                <td className={`p-3 font-medium ${order.status === "Pending" ? "text-red-500" : order.status === "Cancelled" ? "text-white" : "text-green-500"}`}>
                                    {order.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrdersTable;