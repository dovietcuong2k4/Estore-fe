export interface Contact {
  id: number;
  email: string;
  message: string;
  replyMessage?: string;
  contactDate: string;
  replyDate?: string;
  status: 'PENDING' | 'REPLIED';
  responderId?: number;
}

export interface CreateContactRequest {
  email: string;
  message: string;
}
