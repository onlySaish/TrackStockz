import React from 'react';
import { selectActiveContent, selectSidebarVisibility, setActiveContent, toggleSidebar } from '../dashboardSlice';
import { Home, AttachMoney, Inventory2, ShoppingCart, People, AccountCircle, Menu } from '@mui/icons-material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';

interface MenuItem {
  name: string;
  icon: React.ReactElement;
}

function Sidebar() {
  const isSidebarVisible = useAppSelector(selectSidebarVisibility);
  const dispatch = useAppDispatch();
  const activeItem = useAppSelector(selectActiveContent);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleContent = (content: string) => {
    dispatch(setActiveContent(content));
    dispatch(toggleSidebar());
    setIsCollapsed(!isCollapsed);
  };

  const handletoggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    dispatch(toggleSidebar());
  };

  const menuItems: MenuItem[] = [
    { name: 'Home', icon: <Home /> },
    { name: 'Sell', icon: <AttachMoney /> },
    { name: 'Inventory', icon: <Inventory2 /> },
    { name: 'Order', icon: <ShoppingCart /> },
    { name: 'Customers', icon: <People /> },
    { name: 'Profile', icon: <AccountCircle /> },
  ];

  return (
    <div className="flex">
      <div
        className={`${
          isSidebarVisible ? 'block' : 'hidden'
        } w-60 min-h-screen bg-gray-900 text-white flex flex-col items-start p-5 shadow-xl transition-all duration-300 fixed md:relative`}
      >
        <button onClick={handletoggleSidebar} className="flex flex-row justify-center items-center gap-3 px-1 py-3 text-white bg-gray-900">
          <Menu />
          <h2 className={`text-3xl font-bold text-gray-100 block`}>Dashboard</h2>
        </button>
        <div
          className="h-10 z-30 absolute left-0 w-1 bg-white transition-all duration-300 shadow-[0_0_100px_rgba(255,255,255,0.8)]"
          style={{
            top: `${menuItems.findIndex((item) => item.name == activeItem) * 72 + 90}px`,  // Adjust bar position
          }}
        ></div>

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
              <span className={`block`}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
