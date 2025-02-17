import React from 'react'
import ForgotPasswordByEmail from '../features/auth/components/ForgotPasswordByEmail'
import Popup from '../features/Popup'

function ForgotPasswordPage() {
  // const activeContent = useSelector(selectForgotPassActive);
  return (
    <div className="h-screen w-full bg-center bg-cover bg-no-repeat flex flex-row justify-center items-center" style={{backgroundImage : `url(https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`}}>
        <Popup/>.
        <ForgotPasswordByEmail/>
        {/* {activeContent === 'Email' && <ForgotPasswordByEmail/>}
        {activeContent === 'Phone' && <ForgotPasswordByPhone/>} */}
    </div>
  )
}

export default ForgotPasswordPage