export function formatWeight(weight) {
  if (weight >= 1000000) {
    return `${(weight / 1000000).toFixed(2)} M`;
  }
  if (weight >= 100000) {
    return `${Math.round(weight / 1000)}k`;
  }
  return weight.toLocaleString();
}
