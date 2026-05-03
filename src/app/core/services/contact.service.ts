import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Contact } from '../models/contact.model';
import { BaseResultDTO } from '../models/user.model'; // Assuming BaseResultDTO is defined here or similar

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly PATH = '/contact';

  constructor(private api: ApiService) {}

  getAllContacts(): Observable<Contact[]> {
    return this.api.get<BaseResultDTO<Contact[]>>(this.PATH).pipe(
      map(response => response.data)
    );
  }
}
