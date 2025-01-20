import React from 'react'
import SignUp from '../features/auth/components/SignUp'
import Popup from '../features/Popup'

function SignUpPage() {
  return (
    <>
        <div className="min-h-screen w-full bg-center bg-cover flex flex-row justify-center items-center py-8" style={{backgroundImage : `url(https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`}}>
            <Popup/>
            <SignUp/>
        </div>
    </>
  )
}

export default SignUpPage
