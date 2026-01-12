import React, { useEffect, useRef, useState } from 'react';
import { setProfileActiveContent, updatePassword } from '../profileSlice';
import { showPopup } from '../../../../auth/authSlice';
import { useAppDispatch } from '../../../../../hooks';

function ChangePassword(): React.JSX.Element {
    const dispatch = useAppDispatch();
    const [currentPass, setCurrentPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');
    const [confirmPass, setConfirmPass] = useState<string>('');
    const [isPassSame, setIsPassSame] = useState<boolean>(false);
    const currentRef = useRef<HTMLInputElement>(null);
    const newRef = useRef<HTMLInputElement>(null);
    const confirmRef = useRef<HTMLInputElement>(null);

    const togglePasswordVisibility = (
        eyeIcon: HTMLElement,
        inputRef: React.RefObject<HTMLInputElement | null>
    ) => {
        if (!inputRef || !inputRef.current) return;
        const input = inputRef.current;
        if (!input) return;

        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        } else {
            input.type = 'password';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        }
    };

    useEffect(() => {
        setIsPassSame(newPass === confirmPass);
    }, [newPass, confirmPass]);

    const handleSave = async (e: React.FormEvent) => {
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="relative p-4 md:p-6 lg:p-8 rounded-lg bg-gray-800 shadow-lg border border-gray-700 w-full transition-all duration-300">
            <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide text-left mb-0">Change Password</h2>
            </div>
            <div className="flex flex-col gap-5">
                {[{
                    label: 'Current Password',
                    value: currentPass,
                    setValue: setCurrentPass,
                    ref: currentRef,
                }, {
                    label: 'New Password',
                    value: newPass,
                    setValue: setNewPass,
                    ref: newRef,
                }, {
                    label: 'Confirm Password',
                    value: confirmPass,
                    setValue: setConfirmPass,
                    ref: confirmRef,
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
                                onClick={(e) => togglePasswordVisibility(e.currentTarget, ref)}
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
