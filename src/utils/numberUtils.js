export function formatWeight(weight) {
  if (weight >= 100000) {
    return `${Math.round(weight / 1000)}k`;
  }
  return weight.toLocaleString();
}
