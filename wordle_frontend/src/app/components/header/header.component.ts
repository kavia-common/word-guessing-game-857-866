import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly game = inject(GameService);

  // PUBLIC_INTERFACE
  /** Restart the game by selecting a new random target. */
  restart(): void {
    this.game.restart();
  }
}
