export type LivenessType = 'DA' | 'STATE' | 'PROOF'

export function isLivenessType(value: string): value is LivenessType {
  return value === 'DA' || value === 'STATE' || value === 'PROOF'
}

export function LivenessType(value: string): LivenessType {
  if (!isLivenessType(value)) {
    throw new Error(`Invalid liveness type: ${value}`)
  }
  return value
}
