import { Chart } from '@l2beat/common'
import fsx from 'fs-extra'
import path from 'path'

export function outputCharts(charts: Map<string, Chart>) {
  for (const [url, chart] of charts) {
    fsx.mkdirpSync(path.join('build/api', path.dirname(url)))
    fsx.writeFileSync(
      path.join('build/api', `${url}.json`),
      JSON.stringify(chart),
    )
  }
}
