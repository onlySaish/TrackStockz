import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { createUserAsync } from '../authSlice';
import { Navigate } from 'react-router';

function SignupStep3({ userData }) {
    const [form, setForm] = useState({ fullName: "", username: "", avatar: null });
    const [avatarPreview, setAvatarPreview] = useState(form.avatar || 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png');
    const dispatch = useDispatch();
    const [signupSuccess, setSignupSuccess] = useState(false);

      const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        //   setAvatarFile(file);
        form.avatar = file;
          setAvatarPreview(URL.createObjectURL(file)); // Generate a preview URL
        //   console.log("Selected File:", file); // Debugging: log the selected file
        }
        setForm({ ...form, avatar: e.target.files[0] })
      };

      // const handleRemoveAvatar = (e) => {
      //   e.preventDefault();
      //   setForm({ ...form, avatar: null});
      //   setAvatarPreview('https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png');
      // }

      // useEffect(()=>{
      //   if (!form.avatar){
      //       setAvatarPreview(form.avatar || 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png');
      //   }
      // },[avatarPreview])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = { ...userData, ...form };
        const res = await dispatch(createUserAsync(finalData));
        if (res.meta.requestStatus === "fulfilled") {
          setSignupSuccess(true);
        }
        if (res.action.payload === "Unauthorized Access") {
          return <Navigate to="/login" replace={true} />;
        }
      };

      if (signupSuccess) {
        return <Navigate to="/login" replace={true} />;
      }
  return (
    <>
    <div className='h-fit w-3/4 bg-black/75 flex flex-col justify-center items-center rounded-3xl lg:w-2/5'>
            <form 
            onSubmit={handleSubmit} 
            className='h-full w-full flex flex-col justify-evenly items-center'>
            <div className='text-white text-xl font-bold md:text-4xl lg:text-3xl lg:mt-2'>CREATE ACCOUNT</div>

            <div className="flex flex-row items-center gap-4">
            <img
              src={avatarPreview}
              alt="Profile Avatar"
              className="w-40 h-40 rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-110"
            />
            
            <div className='flex flex-col items-center mt- gap-4'>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatarUpload"
              />
              <label
                htmlFor="avatarUpload"
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                Choose Image
              </label>

              {/* <button
                onClick={handleRemoveAvatar}
                id="avatarRemove"
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                Remove Image
              </button> */}
              
            </div>
          </div>

                {/* <div className='w-11/12 px-4 py-2 font-medium md:mt-4 '>
                  <div className='text-white text-sm px-3 md:text-xl'>Select Avatar</div> 
                  <div className='w-full h-8 relative text-xl text-white px-4 py-2'>
                    <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })} />
                  </div>
                </div> */}

                <div className='w-11/12 px-4 py-1 font-medium'>
                    <div className='text-white text-sm px-3 md:text-xl'>Enter Full Name</div>
                    <input 
                    className='w-full mt-2 h-8 text-sm pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    type='text' 
                    placeholder='Full Name'/>
                </div>

                <div className='w-11/12 px-4 py-1 font-medium'>
                    <div className='text-white text-sm px-3 md:text-xl'>Enter Username</div>
                    <input 
                    className='w-full mt-2 h-8 text-sm pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    type='text' 
                    placeholder='Username'/>
                </div>

                <button className='h-auto text-white w-2/4 text-lg font-bold bg-orange-500 mt-2 px-2 py-1 md:py-2 rounded-3xl md:text-3xl md:mt-4 lg:text-2xl lg:py-1 lg:w-1/3'>
                  Sign Up
                </button>
            </form>
            </div>
    </>
  )
}

export default SignupStep3