import React from 'react'
import ProfileCard from './components/ProfileCard'
import EditProfileCard from './components/EditProfileCard'
import ChangePassword from './components/ChangePassword';
import { selectProfileActiveContent } from './profileSlice';
import { useAppSelector } from '../../../../hooks';

function Profile(): React.JSX.Element {
  const activeContent = useAppSelector(selectProfileActiveContent);
  return (
    <div className='py-10 px-4 h-full w-full'>
      {activeContent === 'Profile' && <ProfileCard/>}
      {activeContent === 'EditProfile' && <EditProfileCard/>}
      {activeContent === 'ChangePassword' && <ChangePassword/>}
    </div>
  )
}

export default Profile