import { hashJson } from '@l2beat/shared-pure'

export interface LivenessId extends String {
  _LivenessIdBrand: string
}

export function LivenessId(values: string[]) {
  const hash = hashJson(values)
  const first4bytes = hash.slice(2, 10)
  return first4bytes as unknown as LivenessId
}

LivenessId.unsafe = function unsafe(value: string) {
  return value as unknown as LivenessId
}

LivenessId.random = function random() {
  const letter = () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return LivenessId.unsafe(Array.from({ length: 8 }).map(letter).join(''))
}
