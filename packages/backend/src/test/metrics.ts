import { Gauge, Histogram } from 'prom-client'

import { mock } from './mock'

export function createMockHistogram() {
  return mock<Histogram>({
    labels: () => mock<Histogram>({ observe: () => {} }),
  })
}

export function createMockGauge() {
  return mock<Gauge>({
    labels: () => mock<Gauge>({ set: () => {} }),
  })
}
