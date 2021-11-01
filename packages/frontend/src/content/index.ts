import l2Data from '@l2beat/backend'
import { projects } from '@l2beat/config'

import { createApi } from './api'
import { renderPages } from './pages'

main()
async function main() {
  createApi(projects, l2Data)
  await renderPages(projects, l2Data)
}
