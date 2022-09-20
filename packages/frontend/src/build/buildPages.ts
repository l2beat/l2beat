import { bridges, layer2s } from '@l2beat/config'
import { ApiMain, ProjectId } from '@l2beat/types'

import { renderPages } from '../pages'
import { createApi } from './api'
import { getApiMain } from './ApiMain'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const apiUrl = process.env.API_URL ?? 'https://api.l2beat.com'
  const skipCache = !!process.env.SKIP_CACHE
  const apiMain = await getApiMain(apiUrl, skipCache)

  printApiInfo(apiMain)
  sanityCheck(apiMain)

  const projects = layer2s.filter((p) => !!apiMain.projects[p.id.toString()])
  createApi(projects, apiMain)

  await renderPages(projects, bridges, apiMain)
}

function printApiInfo(apiMain: ApiMain) {
  print('combined', apiMain.combined)
  print('layer2s', apiMain.layers2s)
  print('bridges', apiMain.bridges)
  for (const project of [...layer2s, ...bridges]) {
    const charts = apiMain.projects[project.id.toString()]?.charts
    if (charts) {
      print(project.id.toString(), charts)
    } else {
      console.debug(project.id.toString(), '...', 'MISSING')
    }
  }

  function print(label: string, charts: ApiMain['combined']) {
    const tvl = (charts.hourly.data.at(-1)?.[1] ?? 0).toFixed(2)
    const hourly = charts.hourly.data.length.toString()
    const sixHourly = charts.sixHourly.data.length.toString()
    const daily = charts.daily.data.length.toString()
    console.debug(
      label,
      '.'.repeat(30 - label.length - tvl.length),
      tvl,
      `[H ${hourly.padStart(3, ' ')},`,
      `6H ${sixHourly.padStart(3, ' ')},`,
      `D ${daily.padStart(4, ' ')}]`,
    )
  }
}

function sanityCheck(apiMain: ApiMain) {
  const projectsInApi = Object.keys(apiMain.projects).map(ProjectId)

  const bridgesInApi = bridges.filter((x) => projectsInApi.includes(x.id))
  const layer2sInApi = layer2s.filter((x) => projectsInApi.includes(x.id))

  if (layer2sInApi.length / layer2s.length < 0.8) {
    throw new Error('The API has returned an insufficient number of layer2s')
  }

  if (bridgesInApi.length / bridges.length < 0.8) {
    throw new Error('The API has returned an insufficient number of bridges')
  }

  const emptyChartsExist = [
    apiMain.bridges,
    apiMain.layers2s,
    apiMain.combined,
    ...Object.values(apiMain.projects).map((x) => x?.charts),
  ]
    .flatMap((x) => [x?.daily, x?.sixHourly, x?.hourly])
    .some((x) => x?.data.length === 0)

  if (emptyChartsExist) {
    throw new Error('The API has returned some empty charts')
  }
}
