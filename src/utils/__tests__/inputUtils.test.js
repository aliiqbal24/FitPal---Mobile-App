import { sanitizeInteger, limitSets } from '../inputUtils';

describe('input utilities', () => {
  test('sanitizeInteger removes non digits', () => {
    expect(sanitizeInteger('1a2')).toBe('12');
  });

  test('limitSets caps values to 20', () => {
    expect(limitSets('25')).toBe('20');
    expect(limitSets('10')).toBe('10');
  });
});
