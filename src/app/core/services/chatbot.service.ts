import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseResultDTO } from '../models/user.model';
import { ChatbotRequest, ChatbotResponse } from '../models/chatbot.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly api = inject(ApiService);

  sendMessage(request: ChatbotRequest): Observable<ChatbotResponse> {
    return this.api
      .post<BaseResultDTO<ChatbotResponse>>('/chatbot/message', request)
      .pipe(map(response => response.data));
  }
}
