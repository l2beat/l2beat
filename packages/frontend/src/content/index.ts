import { projects as configProjects } from '@l2beat/config'

import { createApi } from './api'
import { getApiMain } from './ApiMain'
import { renderPages } from './pages'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const apiUrl = process.env.API_URL ?? 'https://api.l2beat.com'
  const skipCache = !!process.env.SKIP_CACHE
  const apiMain = await getApiMain(apiUrl, skipCache)
  const projects = configProjects.filter(
    (p) => !!apiMain.projects[p.id.toString()],
  )
  createApi(projects, apiMain)
  await renderPages(projects, apiMain)
}
