import { Component, HostListener, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { GameService } from '../../services/game.service';
import { RowComponent } from '../row/row.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RowComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  private readonly game = inject(GameService);

  attempts$ = this.game.attempts$;
  currentInput$ = this.game.currentInput$;
  status$ = this.game.status$;

  // PUBLIC_INTERFACE
  /** Handle physical keyboard keydown: letters, Enter, Backspace. */
  @HostListener('window:keydown', ['$event'])
  onKeydown(ev: any): void {
    const key = ev?.key;
    if (key === 'Enter') {
      ev.preventDefault?.();
      this.game.submitGuess();
      return;
    }
    if (key === 'Backspace') {
      ev.preventDefault?.();
      this.game.backspace();
      return;
    }
    if (typeof key === 'string' && /^[a-zA-Z]$/.test(key)) {
      this.game.inputLetter(key.toLowerCase());
    }
  }

  trackByIndex(i: number): number {
    return i;
  }

  readonly maxRows = 5;

  // Build placeholder count array for template
  buildPlaceholders(attemptCount: number): number[] {
    const rowsUsed = Math.min(this.maxRows, attemptCount + 1);
    const remaining = this.maxRows - rowsUsed;
    return Array.from({ length: remaining }, (_, i) => i);
  }
}
