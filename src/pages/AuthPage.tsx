import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Loader from '../features/Loader'
import PopupBar from '../features/PopupBar'
import Login from '../features/auth/components/Login'
import SignupStep1 from '../features/auth/components/SignupStep1'
import SignupStep2 from '../features/auth/components/SignupStep2'
import SignupStep3 from '../features/auth/components/SignupStep3'
import ForgotPassword from '../features/auth/components/ForgotPassword'
import ResetPassword from '../features/auth/components/ResetPassword'
import type { createUserData } from '../features/auth/authTypes'

function AuthPage(): React.JSX.Element {
  const location = useLocation()
  const [step, setStep] = useState<number>(1)
  const [userData, setUserData] = useState<Partial<createUserData>>({})

  const nextStep = (data: Partial<createUserData>) => {
    setUserData((prev) => ({ ...prev, ...data }))
    setStep((prev) => prev + 1)
  }

  // Reset step when route changes
  React.useEffect(() => {
    if (location.pathname === '/signup') {
      setStep(1)
      setUserData({})
    }
  }, [location.pathname])

  const renderContent = () => {
    if (location.pathname === '/login') {
      return <Login />
    }

    if (location.pathname === '/signup') {
      return (
        <div className="min-h-screen w-full bg-center bg-cover bg-gray-900 flex flex-row justify-center items-center py-8">
          {step === 1 && <SignupStep1 nextStep={nextStep} />}
          {step === 2 && <SignupStep2 nextStep={() => nextStep({})} userData={userData} />}
          {step === 3 && <SignupStep3 userData={userData} />}
        </div>
      )
    }

    if (location.pathname === '/forgotpassword') {
      return <ForgotPassword />
    }

    if (location.pathname.startsWith('/resetpassword')) {
      return <ResetPassword />
    }

    return null
  }

  return (
    <>
      <PopupBar />
      <Loader />
      {renderContent()}
    </>
  )
}

export default AuthPage

