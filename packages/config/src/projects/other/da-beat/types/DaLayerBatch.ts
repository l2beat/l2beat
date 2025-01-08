export type DaLayerBatch = {
  /**
   * Batch size for data availability. Together with batchFrequency it determines max throughput.
   * @unit KB - kilobytes
   */
  size: number
  /**
   * Batch frequency for data availability. Together with batchSize it determines max throughput.
   * @unit seconds
   */
  frequency: number
}
