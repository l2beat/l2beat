import { type FinalityDataPoint } from '../schema'

export function divideAndAddLag(
  details: FinalityDataPoint | undefined,
  lag: number,
) {
  if (!details) return undefined
  return {
    averageInSeconds: Math.ceil(details.averageInSeconds / 2 + lag),
    maximumInSeconds: Math.ceil(details.maximumInSeconds),
  }
}
