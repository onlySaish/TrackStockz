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

export interface OrganizationState {
  organizations: Organization[];
  activeOrganizationId: string | null;
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
