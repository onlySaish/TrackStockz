import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { profileSelector } from '../../dashboard/components/Profile/profileSlice';
import { Add, GroupAdd, KeyboardArrowDown, Store, ContentCopy } from '@mui/icons-material';
import { createOrganization, joinOrganization, selectActiveOrganizationId, selectOrganizations, setActiveOrganization } from '../organizationSlice';

const OrganizationSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const organizations = useAppSelector(selectOrganizations);
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const user = useAppSelector(profileSelector); // Get current user

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'join'>('list');
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeOrg = organizations.find(org => org._id === activeOrgId);

  const handleCopyCode = () => {
    if (activeOrg?.inviteCode) {
      navigator.clipboard.writeText(activeOrg.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelect = (id: string) => {
    dispatch(setActiveOrganization(id));
    setIsOpen(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newOrgName && newOrgSlug) {
      try {
        await dispatch(createOrganization({ name: newOrgName, slug: newOrgSlug })).unwrap();
        setView('list');
        setNewOrgName("");
        setNewOrgSlug("");
      } catch (err: any) {
        // Ensure error is a string before setting state
        const errorMessage = typeof err === 'string'
          ? err
          : typeof err.message === 'string'
            ? err.message
            : "Failed to create organization";
        setError(errorMessage);
      }
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (inviteCode) {
      try {
        await dispatch(joinOrganization(inviteCode)).unwrap();
        setView('list');
        setInviteCode("");
      } catch (err: any) {
        // Ensure error is a string before setting state
        const errorMessage = typeof err === 'string'
          ? err
          : typeof err.message === 'string'
            ? err.message
            : "Failed to join organization";
        setError(errorMessage);
      }
    }
  }

  const resetView = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setView('list');
      setError(null);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={resetView}
        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
      >
        <Store className="text-blue-400" />
        <span className="font-semibold max-w-[150px] truncate">
          {activeOrg ? activeOrg.name : "Select Organization"}
        </span>
        <KeyboardArrowDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full text-white right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
          {view === 'list' && (
            <>
              <div className="max-h-60 overflow-y-auto">
                {organizations.map((org) => (
                  <button
                    key={org._id}
                    onClick={() => handleSelect(org._id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center gap-3 ${activeOrgId === org._id ? 'bg-gray-700/50 text-blue-400' : 'text-gray-200'
                      }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="truncate flex-1">{org.name}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-700 p-2 flex flex-col gap-1">
                {activeOrg && (activeOrg.role === 'Owner' || activeOrg.owner === user?._id) && activeOrg.inviteCode && (
                  <div className="px-3 py-2 bg-gray-700/30 rounded-md mb-1 border border-gray-700 border-dashed">
                    <div className="text-xs text-gray-400 mb-1">Invite Code</div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-blue-400 font-bold tracking-wider">{activeOrg.inviteCode}</span>
                      <button
                        onClick={handleCopyCode}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copy Code"
                      >
                        {copied ? <span className="text-green-400 text-xs">Copied!</span> : <ContentCopy fontSize="small" style={{ fontSize: '16px' }} />}
                      </button>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setView('create')}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-md transition-colors text-sm font-medium"
                >
                  <Add fontSize="small" />
                  Create New Organization
                </button>
                <button
                  onClick={() => setView('join')}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-md transition-colors text-sm font-medium"
                >
                  <GroupAdd fontSize="small" />
                  Join an Organization
                </button>
              </div>
            </>
          )}

          {view === 'create' && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">New Organization</h3>
              {error && <div className="text-red-400 text-xs mb-3 bg-red-400/10 p-2 rounded">{error}</div>}
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Slug (unique-id)"
                    value={newOrgSlug}
                    onChange={(e) => setNewOrgSlug(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setView('list'); setError(null); }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-xs"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          )}

          {view === 'join' && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Join Organization</h3>
              {error && <div className="text-red-400 text-xs mb-3 bg-red-400/10 p-2 rounded">{error}</div>}
              <form onSubmit={handleJoin} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Enter Invite Code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setView('list'); setError(null); }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs"
                  >
                    Join
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationSelector;
