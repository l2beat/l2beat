import { Timer } from './types'

export const NativeTimer: Timer = {
  now: Date.now,
  setTimeout,
  clearTimeout,
}
