import React from 'react'
import ProfileCard from './components/ProfileCard'
import EditProfileCard from './components/EditProfileCard'
import ChangePassword from './components/ChangePassword';
import { selectProfileActiveContent } from './profileSlice';
import { useSelector } from 'react-redux';

function Profile() {
  const activeContent = useSelector(selectProfileActiveContent);
  return (
    <div className='p-10 h-full'>
      {activeContent === 'Profile' && <ProfileCard/>}
      {activeContent === 'EditProfile' && <EditProfileCard/>}
      {activeContent === 'ChangePassword' && <ChangePassword/>}
      {/* {activeContent === 'ChangeNumber' && <ChangeNumber/>} */}
    </div>
  )
}

export default Profile