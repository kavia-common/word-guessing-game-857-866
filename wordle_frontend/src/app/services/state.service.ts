import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import type { GameState, GuessResult, LetterStatus, Row, Tile } from '../models/game.types';
import { WordListService } from './word-list.service';
import { evaluateGuess, mergeStatus } from '../utils/evaluator';

/**
 * Central, in-memory state management for the Wordle-style game.
 * - Stores current target, attempts, input, status, used key statuses
 * - Provides input mutations and submission flow
 * - Emits toast messages for validation feedback (SSR-safe: no direct DOM)
 */
@Injectable({
  providedIn: 'root',
})
export class StateService {
  /**
   * Toast stream for non-blocking user messages (e.g., validation errors).
   * Consumers can subscribe to show ephemeral toasts and auto-hide after 2-3s.
   */
  readonly toast$ = new Subject<string>();

  private readonly state$ = new BehaviorSubject<GameState>(this.createInitialState());

  // Selectors
  readonly attempts$: Observable<Row[]> = this.state$.asObservable().pipe(mapState((s) => s.attempts));
  readonly currentInput$: Observable<string> = this.state$.asObservable().pipe(mapState((s) => s.currentInput));
  readonly status$: Observable<GameState['status']> = this.state$.asObservable().pipe(mapState((s) => s.status));
  readonly usedKeyStatuses$: Observable<Record<string, LetterStatus>> = this.state$
    .asObservable()
    .pipe(mapState((s) => s.usedKeyStatuses));
  readonly targetWhenLost$: Observable<string | null> = this.state$
    .asObservable()
    .pipe(mapState((s) => (s.status === 'lost' ? s.target : null)));

  constructor(private readonly wordList: WordListService) {
    // Initialize new game immediately
    this.initNewGame();
  }

  // PUBLIC_INTERFACE
  /** Initialize a fresh game with a random target word. */
  initNewGame(): void {
    const target = this.wordList.getRandomAnswer();
    const next: GameState = {
      target,
      attempts: [],
      currentInput: '',
      maxAttempts: 5,
      status: 'playing',
      usedKeyStatuses: {},
    };
    this.state$.next(next);
  }

  // PUBLIC_INTERFACE
  /** Restart the game, selecting a new target. */
  restart(): void {
    this.initNewGame();
  }

  // PUBLIC_INTERFACE
  /** Append a letter A-Z to current input if game is playing and under 5 chars. */
  inputLetter(ch: string): void {
    const s = this.state$.value;
    if (s.status !== 'playing') return;

    const letter = (ch || '').toLowerCase();
    if (!/^[a-z]$/.test(letter)) return;

    if (s.currentInput.length >= 5) return;

    this.patchState({ currentInput: s.currentInput + letter });
  }

  // PUBLIC_INTERFACE
  /** Remove the last character from current input if any. */
  backspace(): void {
    const s = this.state$.value;
    if (s.status !== 'playing') return;
    if (!s.currentInput) return;

    this.patchState({ currentInput: s.currentInput.slice(0, -1) });
  }

  // PUBLIC_INTERFACE
  /**
   * Submit the current guess:
   * - If length != 5: toast "Enter 5 letters"
   * - If not in word list: toast "Not in word list"
   * - Else evaluate, add row, update keyboard, set status (won/lost/playing)
   * - Clear currentInput after a valid submission
   */
  submitGuess(): void {
    const s = this.state$.value;
    if (s.status !== 'playing') return;

    const guess = s.currentInput.toLowerCase();

    if (guess.length !== 5) {
      this.toast('Enter 5 letters');
      return;
    }

    if (!this.wordList.isValidWord(guess)) {
      this.toast('Not in word list');
      return;
    }

    // Perform evaluation
    const result: GuessResult = evaluateGuess(guess, s.target);
    const newRow: Row = result.tiles.map<Tile>((t) => ({ letter: t.letter, status: t.status }));

    // Update used key statuses with precedence
    const updatedKeyStatuses = { ...s.usedKeyStatuses };
    for (const tile of newRow) {
      const prev = updatedKeyStatuses[tile.letter];
      updatedKeyStatuses[tile.letter] = mergeStatus(prev, tile.status);
    }

    const attempts = [...s.attempts, newRow];
    const won = result.isWin;
    const reachedLimit = attempts.length >= s.maxAttempts;

    const nextStatus: GameState['status'] = won ? 'won' : reachedLimit ? 'lost' : 'playing';

    this.state$.next({
      ...s,
      attempts,
      usedKeyStatuses: updatedKeyStatuses,
      status: nextStatus,
      currentInput: '', // Clear after valid submission
    });
  }

  // Emit a toast message
  private toast(message: string): void {
    // Framework-agnostic: emit on Subject; UI decides rendering and auto-hide timing.
    this.toast$.next(message);
  }

  // Helper to patch partial state objects
  private patchState(patch: Partial<GameState>): void {
    const s = this.state$.value;
    this.state$.next({ ...s, ...patch });
  }

  // Build a minimal initial state until initNewGame() runs
  private createInitialState(): GameState {
    return {
      target: '',
      attempts: [],
      currentInput: '',
      maxAttempts: 5,
      status: 'playing',
      usedKeyStatuses: {},
    };
  }
}

// Small helper to avoid importing RxJS map, keeping dependency footprint light.
// It creates a minimal projection operator using Observable constructor.
function mapState<T, R>(project: (value: T) => R) {
  return (source: Observable<T>) =>
    new Observable<R>((subscriber) => {
      const sub = source.subscribe({
        next: (v) => {
          try {
            subscriber.next(project(v));
          } catch (e) {
            subscriber.error(e);
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete(),
      });
      return () => sub.unsubscribe();
    });
}
