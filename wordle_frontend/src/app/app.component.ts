import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { BoardComponent } from './components/board/board.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, BoardComponent, KeyboardComponent, FooterComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // PUBLIC_INTERFACE
  /** Root component hosting the app shell. */
  title = 'Ocean Wordle';
}
