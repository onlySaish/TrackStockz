import type { RecentOrder } from "../../../dashboardTypes";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'

const RecentOrdersTable = ({ orders }: {  orders: RecentOrder[]  }) => {
    return (
        <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
            <Table className="w-full bg-gray-800 text-white rounded-sm">
                <Thead className="bg-gray-700">
                    <Tr>
                        <Th className="px-4 py-2 text-start">Order ID</Th>
                        <Th className="px-4 py-2">Customer</Th>
                        <Th className="px-4 py-2">Total</Th>
                        <Th className="px-4 py-2">Status</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {orders.map(order => (
                        <Tr key={order.id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer text-center">
                            <Td className="p-3 text-start">{order.id}</Td>
                            <Td className="capitalize p-3">{order.customer}</Td>
                            <Td className="p-3">{order.totalPrice}</Td>
                            <Td className={`p-3 font-medium ${order.status === "Pending" ? "text-red-500" : order.status === "Cancelled" ? "text-white" : "text-green-500"}`}>
                                {order.status}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </div>
    );
};

export default RecentOrdersTable;