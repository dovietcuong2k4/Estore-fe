import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BaseResultDTO, mapUserResponseToUser } from '../models/user.model';
import {
  ProfileData,
  ProfileResponse,
  ProfileUpdateRequest
} from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private api: ApiService) {}

  getMyProfile(): Observable<ProfileData> {
    return this.api.get<BaseResultDTO<ProfileResponse>>('/profile').pipe(
      map((res) => ({
        user: mapUserResponseToUser(res.data.user),
        fields: (res.data.fields ?? []).slice().sort((a, b) => a.order - b.order)
      }))
    );
  }

  updateMyProfile(payload: ProfileUpdateRequest): Observable<ProfileData> {
    return this.api.put<BaseResultDTO<ProfileResponse>>('/profile', payload).pipe(
      map((res) => ({
        user: mapUserResponseToUser(res.data.user),
        fields: (res.data.fields ?? []).slice().sort((a, b) => a.order - b.order)
      }))
    );
  }
}
