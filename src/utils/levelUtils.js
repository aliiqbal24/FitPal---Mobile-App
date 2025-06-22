export function getNextLevelExp(level) {
  return 10 + 3 * (level - 1);
}

export function getLevelInfo(exp) {
  let level = 1;
  let needed = getNextLevelExp(level);
  let remaining = exp;

  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed = getNextLevelExp(level);
  }

  return {
    level,
    expThisLevel: remaining,
    expForNext: needed,
  };
}
