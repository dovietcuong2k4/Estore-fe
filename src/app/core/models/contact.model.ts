export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  replyMessage?: string;
  contactDate: string;
  replyDate?: string;
  status: string;
  responderName?: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
