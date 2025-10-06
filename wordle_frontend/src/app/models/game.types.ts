export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface Tile {
  letter: string;
  status: LetterStatus;
}

export type Row = Tile[];

export interface GuessResult {
  tiles: Tile[];
  isWin: boolean;
}

export interface GameState {
  target: string;
  attempts: Row[];
  currentInput: string;
  maxAttempts: number;
  status: 'playing' | 'won' | 'lost';
  usedKeyStatuses: Record<string, LetterStatus>;
}
