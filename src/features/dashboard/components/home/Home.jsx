import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData, selectHome } from "./homeSlice.js";
import DashboardCard from "./components/DashboardCard";
import RecentOrdersTable from "./components/RecentOrdersTable";
import SalesChart from "./components/SalesChart";

const Home = () => {
    const dispatch = useDispatch();
    const { status, stats, recentOrders } = useSelector(selectHome);

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {status === "loading" ? <p className="text-gray-600">Loading...</p> : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <DashboardCard title="Total Customers" value={stats.totalCustomers} />
                        <DashboardCard title="Total Products" value={stats.totalProducts} />
                        <DashboardCard title="Total Orders" value={stats.totalOrders} />
                        <DashboardCard title="Pending Orders" value={stats.pendingOrders} />
                        <DashboardCard title="Completed Orders" value={stats.completedOrders} />
                        <DashboardCard title="Cancelled Orders" value={stats.cancelledOrders} />
                        <DashboardCard title="Total Revenue" value={`${stats.totalRevenue}`} />
                        <DashboardCard title="Low Stock Alerts" value={stats.lowStockCount} />
                    </div>

                    {/* Sales Chart */}
                    <div className="bg-white p-6 shadow-lg rounded-xl">
                        <SalesChart salesData={stats.salesTrends} />
                    </div>

                    {/* Recent Orders */}
                    <RecentOrdersTable orders={recentOrders} />
                </>
            )}
        </div>
    );
};

export default Home;