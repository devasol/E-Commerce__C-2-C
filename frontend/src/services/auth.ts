import { authAPI } from './api';

export const forgotPasswordOTP = async (email: string) => {
  try {
    const response = await authAPI.forgotPasswordOTP(email);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to send OTP';
    throw new Error(message);
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await authAPI.verifyOTP(email, otp);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to verify OTP';
    throw new Error(message);
  }
};

export const resetPasswordWithOTP = async (email: string, otp: string, newPassword: string) => {
  try {
    const response = await authAPI.resetPasswordWithOTP(email, otp, newPassword);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to reset password';
    throw new Error(message);
  }
};