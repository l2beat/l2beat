const ALPHANUMERIC =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

// Names that end up in paths and URLs: letters, digits and a few extras.
export function isMadeOf(text: string, extra: string): boolean {
  if (text.length === 0) {
    return false
  }
  for (const char of text) {
    if (!ALPHANUMERIC.includes(char) && !extra.includes(char)) {
      return false
    }
  }
  return true
}
