import { projects as configProjects } from '@l2beat/config'

import { createApi } from './api'
import { getL2Data } from './L2Data'
import { renderPages } from './pages'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const apiUrl = process.env.API_URL ?? 'https://api.l2beat.com/api/data'
  const l2Data = await getL2Data(apiUrl)
  // TODO: remove this in the future
  l2Data.byProject['rhino.fi'] = l2Data.byProject.DeversiFi
  const projects = configProjects.filter((p) => !!l2Data.byProject[p.name])
  createApi(projects, l2Data)
  await renderPages(projects, l2Data)
}
