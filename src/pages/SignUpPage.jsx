import React, { useState } from 'react'
// import SignUp from '../features/auth/components/SignUp'
import Popup from '../features/Popup'
// import { useDispatch } from 'react-redux';
import SignupStep1 from '../features/auth/components/SignupStep1';
import SignupStep2 from '../features/auth/components/SignupStep2';
import SignupStep3 from '../features/auth/components/SignupStep3';
import Loader from '../features/Loader';

function SignUpPage() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});

  const nextStep = (data) => {
    setUserData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };
  return (
    <>
        <div className="min-h-screen w-full bg-center bg-cover flex flex-row justify-center items-center py-8" style={{backgroundImage : `url(https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`}}>
            <Popup/>
            <Loader/>
            {step === 1 && <SignupStep1 nextStep={nextStep} />}
            {step === 2 && <SignupStep2 nextStep={nextStep} email={userData.email} userData={userData} />}
            {step === 3 && <SignupStep3 nextStep={nextStep} userData={userData} />}
        </div>
    </>
  )
}

export default SignUpPage
