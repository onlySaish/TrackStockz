import React from 'react';
import { selectActiveContent, selectSidebarVisibility, setActiveContent, toggleSidebar } from '../dashboardSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import OrganizationSelector from '../../organization/components/OrganizationSelector';

interface MenuItem {
  name: string;
  icon: React.ReactElement;
}

function Sidebar() {
  const isSidebarVisible = useAppSelector(selectSidebarVisibility);
  const dispatch = useAppDispatch();
  const activeItem = useAppSelector(selectActiveContent);

  const handleContent = (content: string) => {
    dispatch(setActiveContent(content));
    // Close sidebar on mobile when item clicked
    if (window.innerWidth < 768) {
      dispatch(toggleSidebar());
    }
  };


  const menuItems: MenuItem[] = [
    { name: 'Home', icon: <span className="material-symbols-rounded">home</span> },
    { name: 'Sell', icon: <span className="material-symbols-rounded">attach_money</span> },
    { name: 'Inventory', icon: <span className="material-symbols-rounded">inventory_2</span> },
    { name: 'Order', icon: <span className="material-symbols-rounded">shopping_cart</span> },
    { name: 'Customers', icon: <span className="material-symbols-rounded">people</span> },
    { name: 'Profile', icon: <span className="material-symbols-rounded">account_circle</span> },
  ];

  return (
    <div className="flex w-full h-full">
      <div className="w-full h-full bg-gray-900 text-white flex flex-col items-center pt-5 shadow-xl">
        <div className={`flex items-center w-full mb-6 h-10 transition-all duration-300 ${isSidebarVisible ? 'justify-start px-6 gap-3' : 'justify-center'}`}>
          <button onClick={() => dispatch(toggleSidebar())} className="text-white hover:text-gray-300 transition-colors flex items-center justify-center">
            <span
              className={`material-symbols-rounded cursor-pointer ${isSidebarVisible ? 'text-2xl' : 'text-3xl'} transition-all duration-300`}
              style={{ fontSize: isSidebarVisible ? '24px' : '30px' }}
            >
              {isSidebarVisible ? 'left_panel_close' : 'left_panel_open'}
            </span>
          </button>
          {isSidebarVisible && (
            <h2 className="text-3xl font-bold text-gray-100 whitespace-nowrap">Dashboard</h2>
          )}
        </div>

        <div className={`flex flex-col w-full gap-2 ${isSidebarVisible ? 'mt-2' : 'mt-5'}`}>
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => handleContent(item.name)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer h-16 ${isSidebarVisible ? 'justify-start w-60 mx-auto' : 'justify-center w-full'
                } ${activeItem === item.name
                  ? 'bg-indigo-700 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <span className={`${isSidebarVisible ? 'text-2xl' : 'text-3xl'} flex-shrink-0 flex items-center transition-all duration-300`}>{item.icon}</span>
              <span className={`text-lg whitespace-nowrap ${isSidebarVisible ? 'block' : 'hidden'}`}>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Mobile Organization Selector - Pushed to bottom */}
        <div className="mt-auto w-full md:hidden">
          <OrganizationSelector openUpwards={true} className="w-full rounded-none border-x-0 border-b-0 h-14" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
