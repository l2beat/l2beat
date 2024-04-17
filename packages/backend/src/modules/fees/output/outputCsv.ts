import { writeFile } from 'fs/promises'

import { FeeDataPoint } from '../types'

export { outputCsv }

async function outputCsv(points: FeeDataPoint[], name: string) {
  const delimiter = ','
  const headers = ['timestamp', 'gasPriceUsd', 'gasPriceGwei'].join(delimiter)
  const body = points
    .map((point) =>
      [point.timestamp, point.gasPriceUsd, point.gasPriceGwei].join(delimiter),
    )
    .join('\n')

  return writeFile(`./${name}.csv`, `${headers}\n${body}`)
}
