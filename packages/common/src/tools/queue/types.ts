import type { Histogram } from 'prom-client'

import { Metrics } from '../../utils/wrapAndMeasure'

export interface Job<T> {
  task: T
  attempts: number
  executeAt: number
}

export type ShouldRetry<T> = (
  job: { task: T; attempts: number },
  error: unknown,
) => {
  retry: boolean
  executeAfter?: number
}

type HistogramLabel = 'updater'
export type TaskQueueHistogram = Histogram<HistogramLabel>

export interface TaskQueueOpts<T> {
  workers?: number
  shouldRetry?: ShouldRetry<T>
  trackEvents?: boolean
  metrics?: Metrics<HistogramLabel>
}
