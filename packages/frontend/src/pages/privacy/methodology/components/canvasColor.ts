/** `color` as hex (#rgb or #rrggbb) with an opacity; canvas has no color-mix. */
export function alpha(color: string, opacity: number) {
  const hex = color.replace('#', '')
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex.slice(0, 6)
  const value = Number.parseInt(full, 16)
  if (Number.isNaN(value)) return color
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${Math.max(0, Math.min(1, opacity))})`
}
