import React, { useEffect, useRef, useState } from 'react';
import { setProfileActiveContent, updatePassword } from '../profileSlice';
import { useDispatch } from 'react-redux';
import { showPopup } from '../../../../auth/authSlice';

function ChangePassword() {
    const dispatch = useDispatch();
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isPassSame, setIsPassSame] = useState(false);

    const togglePasswordVisibility = (eyeIcon,inputRef) => {
        if (inputRef.current.type === 'password') {
            inputRef.current.type = 'text';
            eyeIcon.classList.remove("fa-eye-slash")
            eyeIcon.classList.add("fa-eye")
        } else {
            inputRef.current.type = 'password';
            eyeIcon.classList.remove("fa-eye");
            eyeIcon.classList.add("fa-eye-slash");
        }
    };

    useEffect(() => {
        setIsPassSame(newPass === confirmPass);
    }, [newPass, confirmPass]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!isPassSame) {
            dispatch(showPopup({ message: 'Passwords do not match!', duration: 3000, type: 'error' }));
            return;
        }
        if (currentPass === newPass) {
            dispatch(showPopup({ message: 'New password should not be the same as the old password!', duration: 3000, type: 'error' }));
            return;
        }
        dispatch(updatePassword({ oldPassword: currentPass, newPassword: newPass }));
    };

    const handleCancel = () => {
        dispatch(setProfileActiveContent('Profile'));
    };

    return (
        <div className="relative p-10 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border border-gray-700 max-w-md mx-auto transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-200 text-center mb-6">Change Password</h2>
            <div className="flex flex-col gap-5">
                {[{
                    label: 'Current Password',
                    value: currentPass,
                    setValue: setCurrentPass,
                    ref: useRef(null),
                }, {
                    label: 'New Password',
                    value: newPass,
                    setValue: setNewPass,
                    ref: useRef(null),
                }, {
                    label: 'Confirm Password',
                    value: confirmPass,
                    setValue: setConfirmPass,
                    ref: useRef(null),
                }].map(({ label, value, setValue, ref }, index) => (
                    <div key={index} className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                ref={ref}
                                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder={`Enter ${label.toLowerCase()}`}
                            />
                            <button
                                type="button"
                                className="absolute fa-solid fa-eye-slash inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                                onClick={(e) => togglePasswordVisibility(e.target,ref)}
                            >
                            </button>
                        </div>
                    </div>
                ))}
                <div className="flex justify-between mt-5">
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-indigo-500"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
