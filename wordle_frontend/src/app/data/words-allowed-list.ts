//
// Allowed guesses list. Includes ANSWER_WORDS plus additional valid guesses.
// Keeping it compact for demo purposes.
//
import { ANSWER_WORDS } from './words-answer-list';

const EXTRA_ALLOWED_ONLY: string[] = [
  'zesty','xenon','queue','quark','quirk','vague','vivid','solar','lunar','noble',
  'eager','eagle','gleam','gloom','spear','spare','spice','spike','sling','slope',
  'sugar','sushi','toast','tasty','tango','tiger','ultra','omega','novel','proxy',
  'pride','prize','pixel','piano','ocean','shore','coral','bloom','brisk','broad',
  'stern','stern','fjord','glyph','azure','amber','cider','cigar','tidal','rival',
  'risky','mango','melon','lemon','cumin','basil','curry','pearl','perch','perky'
];

// Export a de-duplicated array combining answers and extras.
// Using Set keeps order of first occurrence.
export const ALLOWED_WORDS: string[] = Array.from(
  new Set<string>([...ANSWER_WORDS, ...EXTRA_ALLOWED_ONLY])
);
