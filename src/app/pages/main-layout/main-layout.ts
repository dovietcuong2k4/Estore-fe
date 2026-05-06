import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';
import { ChatbotWidgetComponent } from '../../shared/components/chatbot-widget/chatbot-widget';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ChatbotWidgetComponent],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent {}
