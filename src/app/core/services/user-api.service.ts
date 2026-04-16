import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import {
  AdminUserUpsertRequest,
  BaseResultDTO,
  User,
  UserResponse,
  mapUserResponseToUser
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor(private api: ApiService) {}

  getUsers(): Observable<User[]> {
    return this.api.get<BaseResultDTO<UserResponse[]>>('/admin/users').pipe(
      map(res => (res.data ?? []).map(mapUserResponseToUser))
    );
  }

  createUser(payload: AdminUserUpsertRequest): Observable<User> {
    return this.api.post<BaseResultDTO<UserResponse>>('/admin/users', payload).pipe(
      map(res => mapUserResponseToUser(res.data))
    );
  }

  updateUser(id: number, payload: AdminUserUpsertRequest): Observable<User> {
    return this.api.put<BaseResultDTO<UserResponse>>(`/admin/users/${id}`, payload).pipe(
      map(res => mapUserResponseToUser(res.data))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.api.delete<BaseResultDTO<void>>(`/admin/users/${id}`).pipe(
      map(() => void 0)
    );
  }
}
