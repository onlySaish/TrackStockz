import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveContent, selectSidebarVisibility, setActiveContent } from '../dashboardSlice';
import { Home, AttachMoney, Inventory2, ShoppingCart, People, AccountCircle, Menu } from '@mui/icons-material';
import { useState } from 'react';

function Sidebar() {
  const isSidebarVisible = useSelector(selectSidebarVisibility);
  const dispatch = useDispatch();
  const activeItem = useSelector(selectActiveContent);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleContent = (content) => {
    dispatch(setActiveContent(content));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { name: 'Home', icon: <Home /> },
    { name: 'Sell', icon: <AttachMoney /> },
    { name: 'Inventory', icon: <Inventory2 /> },
    { name: 'Orders', icon: <ShoppingCart /> },
    { name: 'Customers', icon: <People /> },
    { name: 'Profile', icon: <AccountCircle /> },
  ];

  return (
    <div className="flex">
      <button onClick={toggleSidebar} className="p-3 text-white bg-gray-900 md:hidden">
        <Menu />
      </button>
      <div
        className={`${
          isSidebarVisible ? 'block' : 'hidden'
        } ${isCollapsed ? 'w-16' : 'w-60'} h-screen bg-gray-900 text-white flex flex-col items-start p-5 shadow-xl transition-all duration-300 fixed md:relative`}
      >
        <div
          className="h-10 absolute left-0 w-1 bg-white transition-all duration-300 shadow-[0_0_100px_rgba(255,255,255,0.8)]"
          style={{
            top: `${menuItems.findIndex((item) => item.name == activeItem) * 72 + 90}px`,  // Adjust bar position
          }}
        ></div>

        <h2 className={`text-3xl font-bold mb-6 text-gray-100 ${isCollapsed ? 'hidden' : 'block'}`}>Dashboard</h2>
        <div className="flex flex-col w-full gap-4">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => handleContent(item.name)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer text-lg w-full $ {
                activeItem === item.name
                  ? 'bg-indigo-700 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
