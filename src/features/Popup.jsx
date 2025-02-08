import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hidePopup, selectPopup } from '../features/auth/authSlice.js';
import { hidePopup2, selectPopup2 } from './dashboard/components/profile/profileSlice.js';

const Popup = () => {
  const dispatch = useDispatch();
  const authPopup = useSelector(selectPopup);
  const profilePopup = useSelector(selectPopup2);

  const popup = authPopup.visible ? authPopup : profilePopup.visible ? profilePopup : null;

  useEffect(() => {
    if (popup && popup.visible) {
      const timer = setTimeout(() => {
        popup === authPopup ? dispatch(hidePopup()) : dispatch(hidePopup2());
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
      className={`fixed top-10 z-20 right-10 w-80 p-4 border rounded-lg shadow-lg flex items-center ${
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
