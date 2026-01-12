export interface Organization {
  _id: string;
  name: string;
  slug: string;
  owner: string;
  inviteCode?: string;
  createdAt: string;
  updatedAt: string;
  role?: string; // Added role field from membership
}

export interface Member {
  _id: string; // Membership ID
  user: {
    _id: string;
    fullName: string;
    email: string;
    avatar: string;
    username: string;
  };
  organization: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface OrganizationState {
  organizations: Organization[];
  activeOrganizationId: string | null;
  activeOrganizationMembers: Member[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
}

export interface AddMemberRequest {
  email: string;
  role: string;
}
