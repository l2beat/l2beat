export function startsWithLetterOrNumber(str: string) {
  return /^[A-Za-z0-9]/.test(str)
}

export function startsWithNumber(str: string) {
  return /^[0-9]/.test(str)
}
