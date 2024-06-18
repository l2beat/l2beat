export abstract class AbstractStakeAnalyzer {
  abstract analyze(): Promise<{
    totalStake: bigint
    thresholdStake: bigint
  }>
}
