/**
 * Returns an HSL color for a chain based on its index.
 * Chains are evenly spaced around the color wheel so each gets a distinct hue.
 */
export function getChainColor(
  index: number,
  total: number,
  bright?: boolean,
): string {
  const hue = (index * 360) / Math.max(total, 1)
  return bright
    ? `hsl(${hue}, 80%, 70%)`
    : `hsl(${hue}, 70%, 60%)`
}
