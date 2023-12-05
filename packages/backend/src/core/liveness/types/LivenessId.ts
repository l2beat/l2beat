import { hashJson } from '@l2beat/shared-pure'

export interface LivenessId extends Number {
  _LivenessIdBrand: number
}

export function LivenessId(values: string[]) {
  const hash = hashJson(values)
  const first32BitsAsNumber = parseInt(hash.slice(2, 10), 16)
  return first32BitsAsNumber as unknown as LivenessId
}

LivenessId.unsafe = function unsafe(value: number) {
  return value as unknown as LivenessId
}

LivenessId.random = function random() {
  return Math.floor(Math.random() * 2 ** 32) as unknown as LivenessId
}
