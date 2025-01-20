import React, {useEffect, useRef, useState} from 'react'
import { Link } from 'react-router';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser, createUserAsync } from '../authSlice.js';
import { useSelector, useDispatch } from 'react-redux';

  function SignUp() {
  const dispatch = useDispatch();
  
    const [fullName, setFullName] = useState(""); 
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPassSame, setIsPassSame] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [signupSuccess, setSignupSuccess] = useState(false);

    const passref = useRef(null);
    const tooglePassVisibility = (eyeIcon) => {
    if (passref.current.type === "password"){
      eyeIcon.classList.remove("fa-eye-slash")
      eyeIcon.classList.add("fa-eye")
      passref.current.type = "text"
    } else {
      passref.current.type = "password"
      eyeIcon.classList.remove("fa-eye")
      eyeIcon.classList.add("fa-eye-slash")
    }
  }

  const confirmPassRef = useRef(null)
  const toogleConfirmPassVisibility = (eyeIcon) => {
    if (confirmPassRef.current.type === "password"){
      eyeIcon.classList.remove("fa-eye-slash")
      eyeIcon.classList.add("fa-eye")
      confirmPassRef.current.type = "text"
    } else {
      confirmPassRef.current.type = "password"
      eyeIcon.classList.remove("fa-eye")
      eyeIcon.classList.add("fa-eye-slash")
    }
  }

  const isPassSameChecker = () => {
    if (password == confirmPassword){
      setIsPassSame(true);
    } else {
      setIsPassSame(false);
    }
  }

  useEffect(() => {
    isPassSameChecker();
  },[confirmPassword])

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("avatar", avatar);

    const res = await dispatch(createUserAsync(formData));
    if (res.meta.requestStatus === 'fulfilled') {
      setSignupSuccess(true);
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

                <div className='w-11/12 px-4 py-1 font-medium'>
                    <div className='text-white text-sm px-3 md:text-xl'>Enter Full Name</div>
                    <input 
                    className='w-full mt-2 h-8 text-sm pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                    onChange={(e) => setFullName(e.target.value)}
                    type='text' 
                    placeholder='Full Name'/>
                </div>
                
                <div className='w-11/12 px-4 py-1 font-medium'>
                    <div className='text-white text-sm px-3 md:text-xl'>Enter Email</div>
                    <input 
                    className='w-full mt-2 h-8 text-sm pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                    onChange={(e) => setEmail(e.target.value)}
                    type='email' 
                    placeholder='Email'/>
                </div>

                <div className='w-11/12 px-4 py-1 font-medium'>
                    <div className='text-white text-sm px-3 md:text-xl'>Enter Username</div>
                    <input 
                    className='w-full mt-2 h-8 text-sm pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                    onChange={(e) => setUsername(e.target.value)}
                    type='text' 
                    placeholder='Username'/>
                </div>
                
                <div className='w-11/12 px-4 py-2 font-medium '>
                  <div className='text-white text-sm px-3 md:text-xl'>Enter Password</div> 
                  <div className='w-full h-9 relative'>
                    <input 
                    className='w-full mt-2 h-8 text-sm pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                    onChange={(e) => setPassword(e.target.value)}
                    id='pass'
                    type="password"
                    placeholder='Password'
                    ref={passref}/>
                    <div 
                    onClick={(e) => tooglePassVisibility(e.target)}
                    className="hover:cursor-pointer fa-solid fa-eye-slash inline-block absolute right-3 top-3 md:top-4 text-xl md:text-3xl lg:text-2xl lg:top-3 text-black/80"></div>
                  </div>
                </div>

                <div className='w-11/12 px-4 py-2 font-medium md:mt-4 '>
                  <div className='text-white text-sm px-3 md:text-xl'>Confirm Password</div> 
                  <div className='w-full h-9 relative'>
                    <input 
                    className= {` ${((confirmPassword === "") || (password == "")) ? "border-none": `${(isPassSame)? "border-2 border-green-400" : "border-2 border-red-600"}`} w-full mt-2 h-8 text-sm pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10`}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id='confirm-pass'
                    type="password"
                    placeholder='Password'
                    ref={confirmPassRef}/>
                    <div 
                    onClick={(e) => toogleConfirmPassVisibility(e.target)}
                    className="hover:cursor-pointer fa-solid fa-eye-slash inline-block absolute right-3 top-3 md:top-4 text-xl md:text-3xl lg:text-2xl lg:top-3 text-black/80"></div>
                  </div>
                </div>
                
                <div className='w-11/12 px-4 py-2 font-medium md:mt-4 '>
                  <div className='text-white text-sm px-3 md:text-xl'>Select Avatar</div> 
                  <div className='w-full h-8 relative text-xl text-white px-4 py-2'>
                    <input type="file" accept="image/*" onChange={(e) => {setAvatar(e.target.files[0])}} />
                  </div>
                </div>

                <button className='h-auto text-white w-2/4 text-lg font-bold bg-orange-500 mt-2 px-2 py-1 md:py-2 rounded-3xl md:text-3xl md:mt-4 lg:text-2xl lg:py-1 lg:w-1/3'>
                  Sign Up
                </button>
            </form>
            <div className='flex flex-row justify-center gap-2 items-center text-white h-auto w-full text-md md:text-2xl lg:text-xl pb-2'>
                <div>Already have an account?</div>
                <Link to={"/login"} className='text-blue-500 hover:cursor-pointer'>Login here</Link>
            </div>
            </div>
    </>
  )
}

export default SignUp