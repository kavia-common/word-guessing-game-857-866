import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { GameService } from '../../services/game.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private readonly game = inject(GameService);

  status$ = this.game.status$;
  targetWhenLost$ = this.game.targetWhenLost$;

  message$ = this.status$.pipe(
    map((s) => {
      if (s === 'won') return 'Great job! You guessed it!';
      if (s === 'lost') return 'Out of tries.';
      return 'Guess the 5-letter word in 5 tries';
    })
  );

  // PUBLIC_INTERFACE
  /** Restart the game. */
  restart(): void {
    this.game.restart();
  }
}
