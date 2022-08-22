import { Hash256 } from '@l2beat/types'

export function fakeConfigHash(hash?: Hash256, forcedResyncId = 0): string {
  return `${String(hash ?? Hash256.random())}-${forcedResyncId}`
}
