export interface Timer {
  now: () => number
  setTimeout: (callback: () => void, timeMs: number) => number | NodeJS.Timeout
  clearTimeout: (timeout: number) => void
}
