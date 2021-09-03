import l2Data from '@l2beat/backend'
import { projects } from '@l2beat/config'

import { createApi } from './api'
import { renderPages } from './pages'

createApi(projects, l2Data)
renderPages(projects, l2Data)
