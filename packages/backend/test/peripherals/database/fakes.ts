import { Hash256 } from '@l2beat/common'

export function fakeHash(hash?: Hash256, forcedResyncId = 0): string {
  return `${String(hash ?? Hash256.random())}-${forcedResyncId}`
}
