// File: lib/authApi.ts
import axios from 'axios';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  avatar?: string;
}

interface RegisterResponse {
  message: string;
  user: User;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface ProfileData {
  name: string;
  email: string;
  profilePic: string;
  isVerified: boolean;
}

const api = axios.create({
  baseURL: 'https://d29jci2p0msjlf.cloudfront.net/v1/api/auth', // Ganti dengan URL backend Anda
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan interceptor untuk menyertakan token pada setiap permintaan
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Metode untuk registrasi pengguna
export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await api.post('/signup', data);
  return response.data;
};

// Metode untuk login pengguna
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post('/signin', data);
  return response.data;
};

// Metode untuk mengambil data profil pengguna
export const getUserProfile = async (): Promise<ProfileData> => {
  const response = await api.get('/profile'); // Pastikan endpoint ini sesuai dengan backend Anda
  return response.data;
};

// Metode untuk memperbarui foto profil pengguna
export const updateUserProfilePic = async (imageUrl: string): Promise<ProfileData> => {
  const response = await api.put('/profile/picture', { profilePic: imageUrl }); // Pastikan endpoint ini sesuai dengan backend Anda
  return response.data;
};
