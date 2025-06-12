import React from 'react'
import ResetPassword from '../features/auth/components/ResetPassword'
import PopupBar from '../features/PopupBar'
import Loader from '../features/Loader'

function ResetPasswordPage(): React.JSX.Element {
  return (
    <div>
        <PopupBar/>
        <Loader/>
        <ResetPassword/>
    </div>
  )
}

export default ResetPasswordPage