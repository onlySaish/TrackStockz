import { useAppSelector } from "../hooks"; // Make sure you have this hook
import Navbar from "../features/dashboard/components/Navbar";
import Sidebar from "../features/dashboard/components/Sidebar"; 
import Content from "./Content"; 
import { selectSidebarVisibility } from "../features/dashboard/dashboardSlice";
import PopupBar from "../features/PopupBar";
import Loader from "../features/Loader";

const Layout = () => {
  const isSidebarVisible = useAppSelector(selectSidebarVisibility);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <PopupBar/>
      <Loader/>
      <div
        className={`fixed z-20 top-0 left-0 min-h-full bg-gray-800 transition-transform duration-300 ease-in-out ${
          isSidebarVisible ? "transform-none" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>
      <div className="flex-1">
        <div className="fixed top-0 left-0 w-full z-10 bg-gray-900 shadow-sm">
          <Navbar />
        </div>
        <div className="pt-20 h-full overflow-auto">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default Layout;
