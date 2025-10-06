export function getRandomAbstractTokenId(length = 6): string {
  // Generates a random string, removes "0.", and pads until desired length
  return Array.from({ length: Math.ceil(length / 11) }) // each chunk ~11 chars
    .map(() => Math.random().toString(36).slice(2))
    .join('')
    .slice(0, length)
    .toUpperCase()
}
