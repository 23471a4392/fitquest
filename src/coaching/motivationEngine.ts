export interface MotivationalQuote {
  quote: string;
  author: string;
  theme: 'resilience' | 'consistency' | 'discipline' | 'mindset';
}

export const ATHLETIC_MOTIVATION_QUOTES: MotivationalQuote[] = [
  { quote: 'The real purpose of running isn’t to win a race; it’s to test the limits of the human heart.', author: 'Bill Bowerman', theme: 'resilience' },
  { quote: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln', theme: 'discipline' },
  { quote: 'Long-term consistency trumps short-term intensity every single time.', author: 'Bruce Lee', theme: 'consistency' },
  { quote: 'When your legs get tired, run with your heart.', author: 'Dean Karnazes', theme: 'mindset' },
  { quote: 'It never gets easier, you just get faster.', author: 'Greg LeMond', theme: 'resilience' },
];

export function getRandomMotivationalQuote(): MotivationalQuote {
  return ATHLETIC_MOTIVATION_QUOTES[Math.floor(Math.random() * ATHLETIC_MOTIVATION_QUOTES.length)];
}
