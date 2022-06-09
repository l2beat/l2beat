import l2Data from '@l2beat/backend'
import { projects as configProjects } from '@l2beat/config'

import { createApi } from './api'
import { renderPages } from './pages'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const projects = configProjects.filter((p) => !!l2Data.byProject[p.name])
  createApi(projects, l2Data)
  await renderPages(projects, l2Data)
}
