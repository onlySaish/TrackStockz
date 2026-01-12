import { useAppSelector, useAppDispatch } from "../hooks";
import Navbar from "../features/dashboard/components/Navbar";
import Sidebar from "../features/dashboard/components/Sidebar";
import Content from "./Content";
import { selectSidebarVisibility, toggleSidebar } from "../features/dashboard/dashboardSlice";
import PopupBar from "../features/PopupBar";
import Loader from "../features/Loader";

const Layout = () => {
  const isSidebarVisible = useAppSelector(selectSidebarVisibility);
  const dispatch = useAppDispatch();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      <PopupBar />
      <Loader />

      {/* Mobile Backdrop */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar Wrapper */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-full bg-gray-900 transition-all duration-300 ease-in-out md:static md:translate-x-0 flex-shrink-0 overflow-hidden ${isSidebarVisible ? "translate-x-0 w-64" : "-translate-x-full w-64 md:!w-20"
          }`}
      >
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="w-full z-10 bg-gray-900 shadow-sm flex-shrink-0">
          <Navbar />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default Layout;
