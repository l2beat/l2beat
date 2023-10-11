export type LivenessType = 'DA' | 'STATE'

export function isLivenessType(value: string): value is LivenessType {
  return value === 'DA' || value === 'STATE'
}

export function LivenessType(value: string): LivenessType {
  if (!isLivenessType(value)) {
    throw new Error(`Invalid liveness type: ${value}`)
  }
  return value
}
