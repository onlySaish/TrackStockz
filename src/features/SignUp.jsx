import React, {useState} from 'react'

function SignUp() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPassSame, setIsPassSame] = useState(false);

    const pass = document.querySelector("#pass");
    const tooglePassVisibility = (eyeIcon) => {
    if (pass.type === "password"){
      eyeIcon.classList.remove("fa-eye-slash")
      eyeIcon.classList.add("fa-eye")
      pass.type = "text"
    } else {
      pass.type = "password"
      eyeIcon.classList.remove("fa-eye")
      eyeIcon.classList.add("fa-eye-slash")
    }
  }

  const confirmpass = document.querySelector("#confirm-pass");
  const toogleConfirmPassVisibility = (eyeIcon) => {
    if (confirmpass.type === "password"){
      eyeIcon.classList.remove("fa-eye-slash")
      eyeIcon.classList.add("fa-eye")
      confirmpass.type = "text"
    } else {
      confirmpass.type = "password"
      eyeIcon.classList.remove("fa-eye")
      eyeIcon.classList.add("fa-eye-slash")
    }
  }

  return (
    <div className='h-5/6 w-3/4 bg-black/75 flex flex-col justify-center items-center rounded-3xl lg:w-2/5'>
            <form action="#" className='h-full w-full flex flex-col justify-evenly items-center'>
                <div className='text-white text-2xl font-bold md:text-4xl lg:text-3xl lg:mt-2'>CREATE ACCOUNT</div>

                <div className='w-11/12 px-4 py-1 font-medium'>
                    <div className='text-white text-md px-3 md:text-xl'>Enter Email</div>
                    <input 
                    className='w-full mt-2 h-9 text-lg pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                    onChange={(e) => setEmail(e.target.value)}
                    type='email' 
                    placeholder='Email'/>
                </div>

                <div className='w-11/12 px-4 py-1 font-medium'>
                    <div className='text-white text-md px-3 md:text-xl'>Enter Username</div>
                    <input 
                    className='w-full mt-2 h-9 text-lg pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                    onChange={(e) => setUsername(e.target.value)}
                    type='text' 
                    placeholder='Username'/>
                </div>
                
                <div className='w-11/12 px-4 py-2 font-medium '>
                  <div className='text-white text-md px-3 md:text-xl'>Enter Password</div> 
                  <div className='w-full h-9 relative'>
                    <input 
                    className='w-full mt-2 h-9 text-lg pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                    onChange={(e) => setPassword(e.target.value)}
                    id='pass'
                    type="password"
                    placeholder='Password'/>
                    <div 
                    onClick={(e) => tooglePassVisibility(e.target)}
                    className="hover:cursor-pointer fa-solid fa-eye-slash inline-block absolute right-3 top-3 md:top-4 text-2xl md:text-3xl lg:text-2xl lg:top-3 text-black/80"></div>
                  </div>
                </div>

                <div className='w-11/12 px-4 py-2 font-medium md:mt-4 '>
                  <div className='text-white text-md px-3 md:text-xl'>Confirm Password</div> 
                  <div className='w-full h-9 relative'>
                    <input 
                    className='w-full mt-2 h-9 text-lg pl-3 py-4 rounded-3xl text-black/80 md:h-12 md:text-2xl lg:text-xl lg:h-10'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id='confirm-pass'
                    type="password"
                    placeholder='Password'/>
                    <div 
                    onClick={(e) => toogleConfirmPassVisibility(e.target)}
                    className="hover:cursor-pointer fa-solid fa-eye-slash inline-block absolute right-3 top-3 md:top-4 text-2xl md:text-3xl lg:text-2xl lg:top-3 text-black/80"></div>
                  </div>
                </div>

                <button className='h-auto text-white w-2/4 text-lg font-bold bg-orange-500 mt-2 px-2 py-1 md:py-2 rounded-3xl md:text-3xl md:mt-4 lg:text-2xl lg:py-1 lg:w-1/3'>
                  Sign Up
                </button>
            </form>
            <div className='flex flex-row justify-center gap-2 items-center text-white h-auto w-full text-md md:text-2xl lg:text-xl pb-2'>
                <div>Already have an account?</div>
                <a className='text-blue-500 hover:cursor-pointer'>Login here</a>
            </div>
            </div>

  )
}

export default SignUp