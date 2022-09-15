export type Timeout = ReturnType<typeof setTimeout>
export interface Timer {
  now: () => number
  setTimeout: (callback: () => void, timeMs: number) => Timeout
  clearTimeout: (timeout: Timeout) => void
}
