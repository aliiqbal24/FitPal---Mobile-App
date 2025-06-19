export const sanitizeInteger = text => text.replace(/[^0-9]/g, '');

export const limitSets = (value, limit = 20) => {
  const digits = sanitizeInteger(value);
  if (digits === '') return '';
  const num = parseInt(digits, 10);
  return num > limit ? limit.toString() : digits;
};
