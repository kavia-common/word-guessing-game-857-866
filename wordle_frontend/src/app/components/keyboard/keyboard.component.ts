import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { AsyncPipe } from '@angular/common';
import type { LetterStatus } from '../../models/game.types';

type KeyDef = { label: string; code?: string; wide?: boolean };

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.css',
})
export class KeyboardComponent {
  private readonly game = inject(GameService);
  usedKeyStatuses$ = this.game.usedKeyStatuses$;

  // Keyboard layout rows
  row1: KeyDef[] = 'qwertyuiop'.split('').map((c) => ({ label: c }));
  row2: KeyDef[] = 'asdfghjkl'.split('').map((c) => ({ label: c }));
  row3: KeyDef[] = [
    { label: 'Enter', code: 'Enter', wide: true },
    ...'zxcvbnm'.split('').map((c) => ({ label: c })),
    { label: '⌫', code: 'Backspace', wide: true },
  ];

  // PUBLIC_INTERFACE
  /** Handle a key press from on-screen keyboard. */
  onKeyPress(key: KeyDef): void {
    if (key.code === 'Enter') {
      this.game.submitGuess();
      return;
    }
    if (key.code === 'Backspace') {
      this.game.backspace();
      return;
    }
    const letter = key.label;
    if (/^[a-z]$/.test(letter)) {
      this.game.inputLetter(letter);
    }
  }

  // Map status to class helpers
  statusClass(statuses: Record<string, LetterStatus> | null | undefined, ch: string): string {
    const st = (statuses ?? {})[ch];
    if (st === 'correct') return 'status-correct';
    if (st === 'present') return 'status-present';
    if (st === 'absent') return 'status-absent';
    return '';
  }

  trackByLabel = (_: number, item: KeyDef) => item.label;
}
