import React from 'react'
import ForgotPassword from '../features/auth/components/ForgotPassword'
import Popup from '../features/PopupBar'
import Loader from '../features/Loader'

function ForgotPasswordPage() : React.JSX.Element {
  // const activeContent = useSelector(selectForgotPassActive);
  return (
    <>
        <Popup/>
        <Loader/>
        <ForgotPassword/>
        {/* {activeContent === 'Email' && <ForgotPasswordByEmail/>}
        {activeContent === 'Phone' && <ForgotPasswordByPhone/>} */}
    </>
  )
}

export default ForgotPasswordPage