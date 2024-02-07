import { UnixTime } from '@l2beat/shared-pure'

export interface BaseAnalyzer {
  getFinalityWithGranularity(
    from: UnixTime,
    to: UnixTime,
    granularity: number,
  ): Promise<
    | {
        minimum: number
        maximum: number
        average: number
      }
    | undefined
  >
}
