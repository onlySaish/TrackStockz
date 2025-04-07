import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, setCustomerActiveContent, selectStatus2 } from "../customerSlice.js";

const AddCustomer = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus2);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    companyName: "",
    blackListed: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "zipCode", "country"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    dispatch(addCustomer({ formData }));
  };

  const handleCancel = () => {
    dispatch(setCustomerActiveContent("Display"));
  };

  return (
    <div className="mx-auto p-6 m-4 w-11/12 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6">Add New Customer</h2>
      
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="companyName"
          placeholder="Company Name (Optional)"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.address.street}
          onChange={handleChange}
          className="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleChange}
          className="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.address.state}
          onChange={handleChange}
          className="w-1/3 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={formData.address.zipCode}
          onChange={handleChange}
          className="w-1/3 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.address.country}
          onChange={handleChange}
          className="w-1/3 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleCancel}
          className="px-5 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold shadow-md transition-transform duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-md transition-transform duration-300"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddCustomer;
