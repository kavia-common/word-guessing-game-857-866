/**
 * Utilities for evaluating Wordle guesses.
 */
import type { GuessResult, LetterStatus, Tile } from '../models/game.types';

/**
// PUBLIC_INTERFACE
 * Merge two letter statuses with precedence:
 * correct > present > absent > empty
 *
 * This is used for aggregating keyboard key states across guesses.
 */
export function mergeStatus(prev: LetterStatus | undefined, next: LetterStatus): LetterStatus {
  if (!prev) return next;

  // Define precedence order
  const order: Record<LetterStatus, number> = {
    correct: 4,
    present: 3,
    absent: 2,
    empty: 1,
  };

  return order[next] >= order[prev] ? next : prev;
}

/**
// PUBLIC_INTERFACE
 * Evaluate a 5-letter guess against the 5-letter target using Wordle's two-pass logic.
 *
 * Assumptions:
 * - Caller validates that guess and target are exactly 5 letters [a-z].
 * - Function normalizes to lowercase before evaluation.
 *
 * Algorithm:
 * 1) First pass: Mark all exact matches (correct) and decrement counts for those letters.
 * 2) Second pass: For the remaining tiles, mark present if count available for that letter, else absent.
 */
export function evaluateGuess(guess: string, target: string): GuessResult {
  const g = guess.toLowerCase();
  const t = target.toLowerCase();

  // Build letter counts for target
  const counts = new Map<string, number>();
  for (let i = 0; i < 5; i++) {
    const ch = t[i];
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }

  const tiles: Tile[] = Array.from({ length: 5 }, (_, i) => ({
    letter: g[i],
    status: 'absent' as LetterStatus,
  }));

  // First pass: correct positions
  for (let i = 0; i < 5; i++) {
    if (g[i] === t[i]) {
      tiles[i].status = 'correct';
      counts.set(g[i], (counts.get(g[i]) ?? 0) - 1);
    }
  }

  // Second pass: present vs absent
  for (let i = 0; i < 5; i++) {
    if (tiles[i].status === 'correct') continue;
    const ch = g[i];
    const available = counts.get(ch) ?? 0;
    if (available > 0) {
      tiles[i].status = 'present';
      counts.set(ch, available - 1);
    } else {
      tiles[i].status = 'absent';
    }
  }

  const isWin = tiles.every((t) => t.status === 'correct');

  return { tiles, isWin };
}
