import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomer, setCustomerActiveContent, selectStatus2 } from '../customerSlice.js';

const AddCustomer = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus2);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    companyName: '',
    blackListed: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "zipCode", "country"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    dispatch(addCustomer({formData:formData}));
  };

  const handleCancel = () => {
    dispatch(setCustomerActiveContent("Display"));
  };

  return (
    <div className="relative p-6 rounded-2xl border-2 bg-white shadow-2xl max-w-4xl mx-auto transition-transform duration-300 hover:scale-105 z-10">
      <div className="relative bg-white rounded-2xl p-6">
        <div className="flex flex-col">
          {/* Name Fields */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
            <div className="w-1/2">
              <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
          </div>

          {/* Contact Details */}
        <div className='flex gap-4'>
          <div className="flex flex-col mb-4 w-1/2">
            <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
          </div>
          <div className="flex flex-col mb-4 w-1/2">
            <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
          </div>
        </div>

          {/* Address Fields */}
          <div className="flex gap-2 mb-4">
            {['street', 'city', 'state', 'zipCode', 'country'].map((field) => (
              <div key={field} className="w-full sm:w-1/2">
                <label className="text-lg font-semibold text-gray-700 mb-1 ml-2 capitalize">{field}</label>
                <input type="text" name={field} value={formData.address[field]} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
              </div>
            ))}
          </div>

          {/* Company Name */}
          <div className="flex flex-col mb-4">
            <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Company Name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6">
            <button onClick={handleSave} className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl" disabled={status === 'loading'}>
              {status === 'loading' ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleCancel} className="px-5 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
