import { useEffect } from 'react';
import { hidePopup, selectPopup } from './auth/authSlice.js';
import { useAppDispatch, useAppSelector } from '../hooks.js';
import type { PopupState } from './auth/authTypes.js';
import type { Popup } from './dashboard/dashboardTypes.js';
import { hidePopup2, selectPopup2 } from './dashboard/components/Profile/profileSlice.js';
import { hidePopup3, selectPopup3 } from './dashboard/components/Customer/customerSlice.js';
import { hidePopup4, selectPopup4 } from './dashboard/components/Inventory/inventorySlice.js';
import { hidePopup5, selectPopup5 } from './dashboard/components/Sell/sellSlice.js';
import { hidePopup6, selectPopup6 } from './dashboard/components/Order/orderSlice.js';

const PopupBar = () => {
  const dispatch = useAppDispatch();
  const authPopup = useAppSelector(selectPopup);
  const profilePopup = useAppSelector(selectPopup2);
  const customerPopup = useAppSelector(selectPopup3);
  const inventoryPopup = useAppSelector(selectPopup4);
  const sellPopup = useAppSelector(selectPopup5);
  const orderPopup = useAppSelector(selectPopup6);

  const popup: PopupState | Popup | null = authPopup.visible ? authPopup : profilePopup.visible ? profilePopup : customerPopup.visible? customerPopup: inventoryPopup.visible? inventoryPopup : sellPopup.visible? sellPopup : orderPopup.visible? orderPopup : null;

  useEffect(() => {
    if (popup && popup.visible) {
      const timer = setTimeout(() => {
        popup === authPopup ? dispatch(hidePopup()) : popup === profilePopup ? dispatch(hidePopup2()) : popup === customerPopup ?  dispatch(hidePopup3()) : popup === inventoryPopup ? dispatch(hidePopup4()) : popup === sellPopup ? dispatch(hidePopup5()) : dispatch(hidePopup6());
      }, popup.duration);

      return () => clearTimeout(timer);
    }
  }, [popup, dispatch]);

  if (!popup || !popup.visible) return null;

  type PopupType = {
    success: string;
    error: string;
  };

  const popupStyles: PopupType = {
    success: 'bg-gray-900 border-blue-300 text-white',
    error: 'bg-gray-900 border-blue-300 text-white',
  };

  return (
    <div
      className={`fixed top-10 z-50 right-10 w-80 p-4 border rounded-lg shadow-lg flex items-center ${
        popupStyles[popup.type]
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`text-xl ${popup.type === 'success' ? 'text-green-500' : 'text-red-600'}`}>
          {popup.type === 'success' ? (
            <i className="fas fa-check-circle"></i>
          ) : (
            <i className="fas fa-exclamation-circle"></i>
          )}
        </div>
        <div className="flex-grow">
          <p className="font-semibold">{popup.message}</p>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 h-1 ${
          popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
        style={{
          animation: `popupBar ${popup.duration}ms linear`,
        }}
      ></div>
      <style>{`   
        @keyframes popupBar {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
      {/* there was jsx written after style opening */}
    </div>
  );
};

export default PopupBar;
