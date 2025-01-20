import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hidePopup, selectPopup } from '../features/auth/authSlice.js';

const Popup = () => {
  const dispatch = useDispatch();
  const { visible, message, duration, type } = useSelector(selectPopup);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hidePopup());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, dispatch]);

  if (!visible) return null;

  const popupStyles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
  };

  return (
    <div
      className={`fixed top-10 right-10 w-80 p-4 border rounded-lg shadow-lg flex items-center ${
        popupStyles[type]
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`text-xl ${type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {type === 'success' ? (
            <i className="fas fa-check-circle"></i>
          ) : (
            <i className="fas fa-exclamation-circle"></i>
          )}
        </div>
        <div className="flex-grow">
          <p className="font-semibold">{message}</p>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 h-1 ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
        style={{
          animation: `popupBar ${duration}ms linear`,
        }}
      ></div>
      <style jsx>{`
        @keyframes popupBar {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Popup;
