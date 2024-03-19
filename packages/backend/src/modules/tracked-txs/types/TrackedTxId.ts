import { hashJson } from '@l2beat/shared-pure'

// eslint-disable-next-line @typescript-eslint/ban-types
export interface TrackedTxId extends String {
  _TrackedTxIdBrand: string
}

export function TrackedTxId(values: string[]) {
  const hash = hashJson(values)
  const first4bytes = hash.slice(2, 10)
  return first4bytes as unknown as TrackedTxId
}

TrackedTxId.unsafe = function unsafe(value: string) {
  return value as unknown as TrackedTxId
}

TrackedTxId.random = function random() {
  const letter = () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return TrackedTxId.unsafe(Array.from({ length: 8 }).map(letter).join(''))
}
