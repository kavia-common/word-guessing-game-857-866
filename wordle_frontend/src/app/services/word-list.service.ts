import { Injectable } from '@angular/core';
import { ANSWER_WORDS } from '../data/words-answer-list';
import { ALLOWED_WORDS } from '../data/words-allowed-list';

/**
 * Service providing access to word lists and validation logic.
 * Tree-shakeable via providedIn: 'root'.
 */
@Injectable({
  providedIn: 'root',
})
export class WordListService {
  private readonly answers = ANSWER_WORDS;
  private readonly allowed = new Set(ALLOWED_WORDS);

  // PUBLIC_INTERFACE
  /**
   * Get a random answer word from the compact answer list.
   * Returns a lowercase 5-letter word.
   */
  getRandomAnswer(): string {
    const len = this.answers.length;
    // Use Math.random; no reliance on browser-specific globals
    const idx = Math.floor(Math.random() * len);
    return this.answers[idx];
  }

  // PUBLIC_INTERFACE
  /**
   * Check if a word is a valid guess.
   * Valid if:
   * - exactly 5 letters
   * - letters a-z only
   * - present in the allowed list (which includes all answers)
   */
  isValidWord(word: string): boolean {
    if (!word) return false;
    const w = word.toLowerCase().trim();
    if (w.length !== 5) return false;
    if (!/^[a-z]{5}$/.test(w)) return false;
    return this.allowed.has(w);
  }
}
