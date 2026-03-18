export function getChainColor(index: number, total: number): string {
  const hue = (index * 360) / Math.max(total, 1)
  return `hsl(${hue}, 70%, 60%)`
}

export function getChainColorBright(index: number, total: number): string {
  const hue = (index * 360) / Math.max(total, 1)
  return `hsl(${hue}, 80%, 70%)`
}
