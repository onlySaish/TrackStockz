import { useEffect } from "react";
import { fetchDashboardData, selectHome } from "./homeSlice.js";
import { showPopup2 } from "../Profile/profileSlice";
import DashboardCard from "./components/DashboardCard";
import RecentOrdersTable from "./components/RecentOrdersTable";
import SalesChart from "./components/SalesChart";
import { useAppDispatch, useAppSelector } from "../../../../hooks.js";
import { selectActiveOrganizationId, selectOrganizationStatus } from "../../../organization/organizationSlice";

const Home = () => {
    const dispatch = useAppDispatch();
    const { status, stats, recentOrders } = useAppSelector(selectHome);

    const activeOrganizationId = useAppSelector(selectActiveOrganizationId);
    const organizationStatus = useAppSelector(selectOrganizationStatus);

    useEffect(() => {
        if (organizationStatus === 'loading' || organizationStatus === 'idle') return;

        if (!activeOrganizationId) {
            dispatch(showPopup2({
                message: "Please Join or Create an Organization first.",
                type: "error",
                visible: true,
                duration: 3000
            }));
            return;
        }
        dispatch(fetchDashboardData());
    }, [dispatch, activeOrganizationId, organizationStatus]);

    return (
        <div className="py-10 lg:py-4 xl:py-10 px-4 h-full w-full">
            <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>

            {status === "loading" ? <p className="text-gray-600">Loading...</p> : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <DashboardCard title="Total Customers" value={Number(stats?.totalCustomers)} />
                        <DashboardCard title="Total Products" value={Number(stats?.totalProducts)} />
                        <DashboardCard title="Total Orders" value={Number(stats?.totalOrders)} />
                        <DashboardCard title="Pending Orders" value={Number(stats?.pendingOrders)} />
                        <DashboardCard title="Completed Orders" value={Number(stats?.completedOrders)} />
                        <DashboardCard title="Cancelled Orders" value={Number(stats?.cancelledOrders)} />
                        <DashboardCard title="Total Revenue" value={Number(stats?.totalRevenue.toFixed(2))} />
                        <DashboardCard title="Low Stock Alerts" value={Number(stats?.lowStockCount)} />
                    </div>

                    {/* Sales Chart */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg rounded-md">
                        <SalesChart salesData={stats?.salesTrends ?? []} />
                    </div>

                    {/* Recent Orders */}
                    <RecentOrdersTable orders={recentOrders} />
                </>
            )}
        </div>
    );
};

export default Home;