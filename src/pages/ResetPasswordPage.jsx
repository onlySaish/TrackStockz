import React from 'react'
import ResetPassword from '../features/auth/components/ResetPassword'
import Popup from '../features/Popup'
import Loader from '../features/Loader'

function ResetPasswordPage() {
  return (
    // <div className="h-screen w-full bg-center bg-cover bg-no-repeat flex flex-row justify-center items-center" style={{backgroundImage : `url(https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`}}>
    <div>
        <Popup/>
        <Loader/>
        <ResetPassword/>
    </div>
  )
}

export default ResetPasswordPage