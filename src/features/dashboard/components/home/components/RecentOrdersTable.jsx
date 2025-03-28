import React from "react";

const RecentOrdersTable = ({ orders }) => {
    return (
        <div className="mt-8 bg-white p-6 shadow-lg rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        <th className="border p-3">Order ID</th>
                        <th className="border p-3">Customer</th>
                        <th className="border p-3">Total</th>
                        <th className="border p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} className="text-center hover:bg-gray-100 transition">
                            <td className="border p-3">{order.id}</td>
                            <td className="border p-3">{order.customer}</td>
                            <td className="border p-3">{order.totalPrice}</td>
                            <td className={`border p-3 font-medium ${order.status === "Pending" ? "text-red-500" : order.status === "Cancelled" ? "text-gray-800" : "text-green-500"}`}>
                                {order.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentOrdersTable;