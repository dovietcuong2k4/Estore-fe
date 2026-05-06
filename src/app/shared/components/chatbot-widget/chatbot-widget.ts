import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotHistoryMessage, ChatbotProductSuggestion } from '../../../core/models/chatbot.model';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { IconComponent } from '../ui/icon/icon.component';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  products?: ChatbotProductSuggestion[];
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './chatbot-widget.html',
  styleUrl: './chatbot-widget.scss'
})
export class ChatbotWidgetComponent {
  @ViewChild('messageList') private messageList?: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  input = signal('');
  loading = signal(false);
  messages = signal<ChatMessage[]>([
    {
      id: Date.now(),
      role: 'assistant',
      content: 'Xin chào, mình có thể tư vấn laptop, điện thoại và phụ kiện theo ngân sách, nhu cầu học tập, làm việc, gaming hoặc thiết kế.'
    }
  ]);

  readonly quickPrompts = [
    'Laptop học tập dưới 15 triệu',
    'Điện thoại chụp ảnh tốt',
    'Máy chơi game tầm 25 triệu'
  ];

  constructor(private chatbotService: ChatbotService) {}

  toggle(): void {
    this.isOpen.set(!this.isOpen());
    this.scrollToBottom();
  }

  close(): void {
    this.isOpen.set(false);
  }

  sendMessage(text = this.input()): void {
    const message = text.trim();
    if (!message || this.loading()) {
      return;
    }

    const history = this.buildHistory();
    this.input.set('');
    this.loading.set(true);
    this.messages.update(messages => [
      ...messages,
      {
        id: Date.now(),
        role: 'user',
        content: message
      }
    ]);
    this.scrollToBottom();

    this.chatbotService.sendMessage({ message, history }).subscribe({
      next: response => {
        this.messages.update(messages => [
          ...messages,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: response.answer,
            products: response.suggestions ?? []
          }
        ]);
        this.loading.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.messages.update(messages => [
          ...messages,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: 'Mình chưa kết nối được chatbot. Bạn thử lại sau hoặc tìm sản phẩm trực tiếp trên trang sản phẩm.'
          }
        ]);
        this.loading.set(false);
        this.scrollToBottom();
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  private buildHistory(): ChatbotHistoryMessage[] {
    return this.messages()
      .slice(-8)
      .map(message => ({
        role: message.role,
        content: message.content
      }));
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.messageList?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, 0);
  }
}
