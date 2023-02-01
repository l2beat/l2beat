import { mock } from '@l2beat/common'
import { Gauge, Histogram } from 'prom-client'

import { Metrics } from '../../Metrics'

export function createMockRepoMetrics() {
  return mock<Metrics>({
    repositoryHistogram: createMockHistogram(),
  })
}

export function createMockTvlMetrics() {
  return mock<Metrics>({
    forTvl: () => ({
      labels: { updater: 'updater' },
      histogram: createMockHistogram(),
    }),
  })
}

export function createMockHistogram() {
  return mock<Histogram>({ startTimer: () => () => 0 })
}

export function createMockGauge() {
  return mock<Gauge>({
    labels: () => mock<Gauge>({ set: () => {} }),
  })
}
