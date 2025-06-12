export interface PopupState {
  visible: boolean;
  message: string;
  duration: number;
  type: 'success' | 'error';
}

export type sendOtpData = {
  email: string;
  password: string;
};

export type verifyOtpData = {
  email: string;
  otp: string;
};

export interface createUserData {
  email: string;
  password: string;
  username: string;
  fullName: string;
  avatar: File | null;
}

export type LoginInfo = FormData;

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}
