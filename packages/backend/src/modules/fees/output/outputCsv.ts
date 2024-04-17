import { writeFile } from 'fs/promises'

import { FeeDataPoint } from '../types'

export { outputCsv }

async function outputCsv(points: FeeDataPoint[], name: string) {
  const delimiter = ','
  const headers = ['timestamp', 'gasPriceUsd'].join(delimiter)
  const body = points.map((point) =>
    [point.timestamp, point.gasPriceUsd].join(delimiter),
  )

  return writeFile(`./${name}.csv`, [headers, body].join('\n'))
}
