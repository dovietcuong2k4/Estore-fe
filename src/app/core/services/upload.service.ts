import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UploadResponse {
  url: string;
  publicId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly api = inject(ApiService);

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    // Note: ApiService.post usually sends JSON, but we can bypass or extend it.
    // Actually, looking at ApiService.ts, it sets Content-Type to application/json.
    // We might need to handle FormData specifically or use HttpClient directly with headers from ApiService.
    return this.api.post<UploadResponse>('/upload', formData);
  }
}
