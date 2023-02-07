import { mock } from '@l2beat/shared'
import { Gauge, Histogram } from 'prom-client'

export function createMockHistogram() {
  return mock<Histogram>({ startTimer: () => () => 0 })
}

export function createMockGauge() {
  return mock<Gauge>({
    labels: () => mock<Gauge>({ set: () => {} }),
  })
}
