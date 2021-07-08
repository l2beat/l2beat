import fsx from 'fs-extra'
import path from 'path'
import { ChartData } from '../L2Data'

export function outputCharts(charts: Map<string, ChartData>) {
  for (const [url, chart] of charts) {
    fsx.mkdirpSync(path.join('build/api', path.dirname(url)))
    fsx.writeFileSync(
      path.join('build/api', `${url}.json`),
      JSON.stringify(chart)
    )
  }
}
