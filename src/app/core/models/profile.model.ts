import { User, UserResponse } from './user.model';

export type ProfileFieldType =
  | 'TEXT'
  | 'EMAIL'
  | 'TEL'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'TAGS';

export interface ProfileFieldMetadata {
  name: string;
  label: string;
  type: ProfileFieldType;
  editable: boolean;
  required: boolean;
  maxLength: number | null;
  pattern: string;
  placeholder: string;
  order: number;
}

export interface ProfileResponse {
  user: UserResponse;
  fields: ProfileFieldMetadata[];
}

export interface ProfileUpdateRequest {
  updates: Record<string, string>;
}

export interface ProfileData {
  user: User;
  fields: ProfileFieldMetadata[];
}
