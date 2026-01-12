import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../hooks';
import {
  fetchUserOrganizations,
  joinOrganization,
  fetchOrganizationMembers,
  removeMember,
  selectOrganizations,
  selectActiveOrganizationMembers,
  selectOrganizationStatus
} from '../../../../organization/organizationSlice';
import { profileSelector, showPopup2 } from '../../Profile/profileSlice';

const OrganizationManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const organizations = useAppSelector(selectOrganizations);
  const activeMembers = useAppSelector(selectActiveOrganizationMembers);
  const status = useAppSelector(selectOrganizationStatus);
  const currentUser = useAppSelector(profileSelector);

  const [inviteCode, setInviteCode] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'members'>('list');

  useEffect(() => {
    dispatch(fetchUserOrganizations());
  }, [dispatch]);

  const handleJoinOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    try {
      await dispatch(joinOrganization(inviteCode)).unwrap();
      dispatch(showPopup2({
        message: 'Successfully joined organization!',
        type: 'success',
        duration: 3000,
        visible: true
      }));
      setInviteCode('');
    } catch (error: any) {
      dispatch(showPopup2({
        message: error || 'Failed to join organization',
        type: 'error',
        duration: 3000,
        visible: true
      }));
    }
  };

  const handleViewMembers = async (orgId: string) => {
    setSelectedOrgId(orgId);
    try {
      await dispatch(fetchOrganizationMembers(orgId)).unwrap();
      setViewMode('members');
    } catch (error: any) {
      dispatch(showPopup2({
        message: 'Failed to fetch members',
        type: 'error',
        duration: 3000,
        visible: true
      }));
    }
  };

  const handleBackToOrgs = () => {
    setViewMode('list');
    setSelectedOrgId(null);
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    dispatch(showPopup2({
      message: 'Invite code copied!',
      type: 'success',
      duration: 2000,
      visible: true
    }));
  };

  const handleRemoveMember = async (memberUserId: string) => {
    if (!selectedOrgId) return;
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await dispatch(removeMember({ organizationId: selectedOrgId, memberId: memberUserId })).unwrap();
        dispatch(showPopup2({
          message: 'Member removed successfully',
          type: 'success',
          duration: 3000,
          visible: true
        }));
      } catch (error: any) {
        dispatch(showPopup2({
          message: error || 'Failed to remove member',
          type: 'error',
          duration: 3000,
          visible: true
        }));
      }
    }
  };

  const selectedOrg = organizations.find(o => o._id === selectedOrgId);
  const isOwner = selectedOrg?.role === 'Owner' || selectedOrg?.owner === currentUser._id;

  return (
    <div className="bg-gray-800 p-4 md:p-6 lg:p-8 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide truncate pr-2">
          {viewMode === 'list' ? 'Manage Organizations' : `Members: ${selectedOrg?.name}`}
        </h2>
        {viewMode === 'members' && (
          <button onClick={handleBackToOrgs} className="text-gray-300 hover:text-white px-3 py-1.5 md:px-4 md:py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm md:text-base transition-colors font-medium shrink-0">
            <i className="fa-solid fa-arrow-left mr-2"></i>Back
          </button>
        )}
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Join Organization */}
          <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gray-900/50 rounded-xl border border-gray-700">
            <h3 className="text-lg md:text-xl font-semibold text-gray-200 mb-3 md:mb-4">Join Organization</h3>
            <form onSubmit={handleJoinOrganization} className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <input
                type="text"
                placeholder="Enter Invite Code"
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 md:px-4 md:py-3 text-white text-base md:text-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-base md:text-lg font-medium transition-colors shadow-lg shadow-blue-900/20 w-full sm:w-auto"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Joining...' : 'Join'}
              </button>
            </form>
          </div>

          {/* Organization List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <h3 className="text-lg md:text-xl font-semibold text-gray-200 mb-3 md:mb-4">Your Organizations</h3>
            {organizations.length === 0 ? (
              <p className="text-gray-400 text-base md:text-lg text-center py-8">You haven't joined any organizations yet.</p>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {organizations.map(org => (
                  <div key={org._id} className="p-4 md:p-5 bg-gray-900/30 border border-gray-700 rounded-xl hover:border-gray-500 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 group">
                    <div className="w-full sm:w-auto">
                      <p className="text-white text-lg md:text-xl lg:text-2xl font-semibold tracking-wide break-words">{org.name}</p>
                      <span className={`text-sm md:text-base px-2 py-0.5 md:px-3 md:py-1 rounded-full inline-block mt-1 md:mt-2 font-medium ${org.role === 'Owner' ? 'bg-amber-900/40 text-amber-200 border border-amber-800/50' : 'bg-blue-900/40 text-blue-200 border border-blue-800/50'}`}>
                        {org.role || 'Member'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full sm:w-auto justify-start sm:justify-end mt-2 sm:mt-0">
                      {org.inviteCode && (
                        <div className="flex items-center bg-gray-800/80 rounded-lg border border-gray-600/50 px-2 py-1.5 md:px-3 md:py-2 gap-2 md:gap-3">
                          <span className="text-xs md:text-sm text-gray-400 uppercase tracking-wider font-semibold hidden xs:inline">Code:</span>
                          <span className="text-sm md:text-base lg:text-lg font-mono text-gray-100 tracking-wider">{org.inviteCode}</span>
                          <button
                            onClick={() => handleCopyCode(org.inviteCode!)}
                            className="text-gray-400 hover:text-white transition-colors p-1"
                            title="Copy Code"
                          >
                            <i className="fa-regular fa-copy text-base md:text-lg"></i>
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => handleViewMembers(org._id)}
                        className="text-gray-200 hover:text-white px-3 py-2 md:px-5 md:py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm md:text-base font-medium transition-colors shadow-md whitespace-nowrap"
                      >
                        Members
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Members View (Inline) */
        <div className="flex-1 flex flex-col overflow-hidden">

          {isOwner && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-900/20 border border-blue-800/50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-sm md:text-base text-blue-200 font-medium">Invite Code:</span>
              <span className="font-mono text-white bg-gray-900/80 px-3 py-1.5 md:px-4 md:py-2 rounded-lg select-all text-base md:text-xl border border-gray-600 tracking-wider w-full sm:w-auto text-center">{selectedOrg?.inviteCode || '...'}</span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-2 md:space-y-3">
              {activeMembers.map(member => (
                <div key={member._id} className="flex items-center justify-between p-3 md:p-4 bg-gray-900/30 rounded-xl border border-gray-700/50 hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600 shrink-0 shadow-sm">
                      {member.user.avatar ? (
                        <img src={member.user.avatar} alt={member.user.username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-base md:text-lg font-bold text-gray-300">{member.user.fullName?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-base md:text-lg lg:text-xl font-medium text-white">{member.user.fullName}</p>
                      <p className="text-sm md:text-base text-gray-400 capitalize mt-0.5">{member.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3">
                    {member.user._id === currentUser._id && (
                      <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 font-bold bg-gray-800 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md border border-gray-700">You</span>
                    )}
                    {isOwner && member.user._id !== currentUser._id && (
                      <button
                        onClick={() => handleRemoveMember(member.user._id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 md:p-2.5 rounded-lg transition-colors"
                        title="Remove User"
                      >
                        <i className="fa-solid fa-trash-can text-base md:text-lg"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManager;
