import { Timer } from './types'

export const nativeTimer: Timer = {
  now: Date.now,
  setTimeout,
  clearTimeout,
}
