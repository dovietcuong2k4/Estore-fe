export type RoleName = 'ADMIN' | 'CUSTOMER' | 'SHIPPER' | 'STAFF';

export interface Role {
  id: number;
  name: RoleName;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  roles: Role[];
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
