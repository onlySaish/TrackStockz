import React from 'react'
import ProfileCard from './components/ProfileCard'
import EditProfileCard from './components/EditProfileCard'
import ChangePassword from './components/ChangePassword';
// import ChangeNumber from './components/ChangeNumber';
import { selectProfileActiveContent } from './profileSlice';
import { useSelector } from 'react-redux';

function Profile() {
  const activeContent = useSelector(selectProfileActiveContent);
  return (
    <>
      {activeContent === 'Profile' && <ProfileCard/>}
      {activeContent === 'EditProfile' && <EditProfileCard/>}
      {activeContent === 'ChangePassword' && <ChangePassword/>}
      {/* {activeContent === 'ChangeNumber' && <ChangeNumber/>} */}
    </>
  )
}

export default Profile