import React from 'react'
import ProfileCard from './components/ProfileCard'
import EditProfileCard from './components/EditProfileCard'
import ChangePassword from './components/ChangePassword';
import OrganizationManager from './components/OrganizationManager';
import { selectProfileActiveContent } from './profileSlice';
import { useAppSelector } from '../../../../hooks';

function Profile(): React.JSX.Element {
  const activeContent = useAppSelector(selectProfileActiveContent);
  return (
    <div className='py-6 px-6 h-full w-full overflow-y-auto custom-scrollbar'>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full h-full">
        {/* Left Column: Profile Actions */}
        <div className="flex flex-col gap-6">
          {activeContent === 'Profile' && <ProfileCard />}
          {activeContent === 'EditProfile' && <EditProfileCard />}
          {activeContent === 'ChangePassword' && <ChangePassword />}
        </div>

        {/* Right Column: Organization Management */}
        <div className="h-full min-h-[500px]">
          <OrganizationManager />
        </div>
      </div>
    </div>
  )
}

export default Profile