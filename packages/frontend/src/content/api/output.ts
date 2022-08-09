import { Charts } from '@l2beat/common'
import fsx from 'fs-extra'
import path from 'path'

export function outputCharts(urlCharts: Map<string, Charts>) {
  for (const [url, charts] of urlCharts) {
    fsx.mkdirpSync(path.join('build/api', path.dirname(url)))
    fsx.writeFileSync(
      path.join('build/api', `${url}.json`),
      JSON.stringify(charts),
    )
  }
}
