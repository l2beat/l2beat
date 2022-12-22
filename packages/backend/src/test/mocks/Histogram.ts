import { mock } from '@l2beat/common'
import { Histogram } from 'prom-client'

export function createMockHistogram() {
  return mock<Histogram>({
    labels: () => mock<Histogram>({ observe: () => {} }),
  })
}
