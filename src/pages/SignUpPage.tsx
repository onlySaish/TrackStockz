import React, { useState } from 'react'
import Loader from '../features/Loader';
import SignupStep1 from '../features/auth/components/SignupStep1';
import SignupStep2 from '../features/auth/components/SignupStep2';
import SignupStep3 from '../features/auth/components/SignupStep3';
import type { createUserData } from '../features/auth/authTypes';
import PopupBar from '../features/PopupBar';

function SignUpPage(): React.JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [userData, setUserData] = useState<Partial<createUserData>>({});

  const nextStep = (data: Partial<createUserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };
  return (
    <>
      <div className="min-h-screen w-full bg-center bg-cover bg-gray-900 flex flex-row justify-center items-center py-8">
        <PopupBar/>
        <Loader/>
        {step === 1 && <SignupStep1 nextStep={nextStep} />}
        {step === 2 && <SignupStep2 nextStep={() => nextStep({})} userData={userData} />}
        {step === 3 && <SignupStep3 userData={userData} />}
      </div>
    </>
  )
}

export default SignUpPage
