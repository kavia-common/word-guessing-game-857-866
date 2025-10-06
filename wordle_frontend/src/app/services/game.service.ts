import { Injectable } from '@angular/core';
import type { GameState, Row, LetterStatus } from '../models/game.types';
import { StateService } from './state.service';
import { Observable } from 'rxjs';

/**
 * Facade service that wraps StateService for convenience.
 * Components can inject GameService for a stable API surface.
 */
@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private readonly state: StateService) {}

  // PUBLIC_INTERFACE
  /** Stream of attempts (rows). */
  get attempts$(): Observable<Row[]> {
    return this.state.attempts$;
  }

  // PUBLIC_INTERFACE
  /** Stream of current input string. */
  get currentInput$(): Observable<string> {
    return this.state.currentInput$;
  }

  // PUBLIC_INTERFACE
  /** Stream of game status. */
  get status$(): Observable<GameState['status']> {
    return this.state.status$;
  }

  // PUBLIC_INTERFACE
  /** Stream of keyboard key statuses. */
  get usedKeyStatuses$(): Observable<Record<string, LetterStatus>> {
    return this.state.usedKeyStatuses$;
  }

  // PUBLIC_INTERFACE
  /** Emits target word when game is lost, else null. */
  get targetWhenLost$(): Observable<string | null> {
    return this.state.targetWhenLost$;
  }

  // PUBLIC_INTERFACE
  /** Toast messages for validation feedback. */
  get toast$() {
    return this.state.toast$;
  }

  // PUBLIC_INTERFACE
  /** Input methods */
  inputLetter(ch: string): void {
    this.state.inputLetter(ch);
  }

  // PUBLIC_INTERFACE
  /** Remove last input character */
  backspace(): void {
    this.state.backspace();
  }

  // PUBLIC_INTERFACE
  /** Submit current guess */
  submitGuess(): void {
    this.state.submitGuess();
  }

  // PUBLIC_INTERFACE
  /** Restart the game */
  restart(): void {
    this.state.restart();
  }
}
