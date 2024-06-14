export abstract class AbstractStakeAnalyzer {
  abstract analyze(): Promise<{
    totalStake: number
    thresholdStake: number
  }>
}
