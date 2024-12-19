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

const api = axios.create({
  baseURL: 'http://localhost:8000/v1/api/auth', // Ganti dengan URL backend Anda
});

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await api.post('/signup', data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post('/signin', data);
  return response.data;
};
