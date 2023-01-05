import { mock } from '@l2beat/common'
import { Histogram } from 'prom-client'

import { Metrics } from '../../Metrics'

export function createMockMetrics() {
  return mock<Metrics>({
    repositoryHistogram: createMockHistogram(),
  })
}

export function createMockHistogram() {
  return mock<Histogram>({
    labels: () => mock<Histogram>({ observe: () => {} }),
  })
}
