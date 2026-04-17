export type RoleName = 'ROLE_ADMIN' | 'ROLE_CUSTOMER' | 'ROLE_SHIPPER' | 'ROLE_STAFF';

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

/** Matches BE UserResponse exactly */
export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

/** Matches BE AuthResponse: token + user info */
export interface AuthResponse {
  token: string;
  user: UserResponse;
}

/** Generic BE response wrapper */
export interface BaseResultDTO<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode: string | null;
  count: number | null;
}

export interface AdminUserUpsertRequest {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  roles: string[];
}

/** Maps BE UserResponse to FE User */
export function mapUserResponseToUser(res: UserResponse): User {
  return {
    id: res.id,
    fullName: res.fullName,
    email: res.email,
    phone: res.phone ?? '',
    address: res.address ?? '',
    roles: (res.roles ?? []).map((name, index) => {
      return {
        id: index + 1,
        name: name as RoleName
      };
    })
  };
}
