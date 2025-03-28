import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hidePopup, selectPopup } from '../features/auth/authSlice.js';
import { hidePopup2, selectPopup2 } from './dashboard/components/profile/profileSlice.js';
import { hidePopup3, selectPopup3 } from './dashboard/components/customer/customerSlice.js';
import { hidePopup4, selectPopup4 } from './dashboard/components/inventory/inventorySlice.js';
import { hidePopup5, selectPopup5 } from './dashboard/components/sell/sellSlice.js';
import { hidePopup6, selectPopup6 } from './dashboard/components/order/orderSlice.js';

const Popup = () => {
  const dispatch = useDispatch();
  const authPopup = useSelector(selectPopup);
  const profilePopup = useSelector(selectPopup2);
  const customerPopup = useSelector(selectPopup3);
  const inventoryPopup = useSelector(selectPopup4);
  const sellPopup = useSelector(selectPopup5);
  const orderPopup = useSelector(selectPopup6);


  const popup = authPopup.visible ? authPopup : profilePopup.visible ? profilePopup : customerPopup.visible? customerPopup: inventoryPopup.visible? inventoryPopup : sellPopup.visible? sellPopup : orderPopup.visible? orderPopup : null;

  useEffect(() => {
    if (popup && popup.visible) {
      const timer = setTimeout(() => {
        popup === authPopup ? dispatch(hidePopup()) : popup === profilePopup ? dispatch(hidePopup2()) : popup === customerPopup ?  dispatch(hidePopup3()) : popup === inventoryPopup ? dispatch(hidePopup4()) : popup === sellPopup ? dispatch(hidePopup5()) : dispatch(hidePopup6());
      }, popup.duration);

      return () => clearTimeout(timer);
    }
  }, [popup, dispatch]);

  if (!popup || !popup.visible) return null;

  const popupStyles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
  };

  return (
    <div
      className={`fixed top-10 z-50 right-10 w-80 p-4 border rounded-lg shadow-lg flex items-center ${
        popupStyles[popup.type]
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`text-xl ${popup.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
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

export default Popup;
