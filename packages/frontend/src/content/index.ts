import { projects as configProjects } from '@l2beat/config'

import { createApi } from './api'
import { getApiMain } from './ApiMain'
import { renderPages } from './pages'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const apiMain = await getApiMain()
  const projects = configProjects.filter((p) => !!apiMain.projects[p.name])
  createApi(projects, apiMain)
  await renderPages(projects, apiMain)
}
