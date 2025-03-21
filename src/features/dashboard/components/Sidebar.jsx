import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveContent, selectSidebarVisibility, setActiveContent } from '../dashboardSlice';

function Sidebar() {
  const isSidebarVisible = useSelector(selectSidebarVisibility);
  const dispatch = useDispatch();
  const activeItem = useSelector(selectActiveContent);

  const handleContent = (content) => {
    dispatch(setActiveContent(content));
  };

  const menuItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'Sell', icon: '💸' },
    { name: 'Inventory', icon: '📦' },
    { name: 'Orders', icon: '🛒' },
    { name: 'Customers', icon: '👥' },
    { name: 'Profile', icon: '👤' },
  ];

  return (
    <div
      className={`${
        isSidebarVisible ? 'block' : 'hidden'
      } h-screen relative w-full px-5 bg-gradient-to-br from-violet-600 to-violet-900 rounded-tr-3xl border-none flex flex-col items-center text-white text-center gap-6 pt-8 shadow-lg`}
    >
      <div
        className="h-10 absolute left-0 w-1 bg-white transition-all duration-300 shadow-[0_0_100px_rgba(255,255,255,0.8)]"
        style={{
          top: `${menuItems.findIndex((item) => item.name == activeItem) * 65 + 90}px`,  // Adjust bar position
        }}
      ></div>
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="flex flex-col w-full items-left gap-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => handleContent(item.name)}
            className={`w-full py-2 px-4 flex items-center justify-start gap-2 rounded-full text-lg transition-transform transform hover:scale-105 ${
              activeItem === item.name
                ? 'bg-violet-800 shadow-md'
                : 'bg-transparent hover:bg-violet-700'
            } cursor-pointer`}
            title={item.name} // Tooltip for better UX
          >
            <span className="text-2xl">{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
