import { Logger } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { ActivityConfig } from '../../config/Config'
import { createActivityModule, shouldIncludeProject } from './ActivityModule'

const ENV_CONFIG: ActivityConfig = {
  starkexApiKey: 'key',
  starkexCallsPerMinute: 1,
  projectsExcludedFromAPI: [],
  projects: [],
}

describe(createActivityModule.name, () => {
  describe(shouldIncludeProject.name, () => {
    it('include project there is no exclusion rule', () => {
      const result = shouldIncludeProject(
        ProjectId('project'),
        ENV_CONFIG,
        Logger.SILENT,
      )
      expect(result).toEqual(true)
    })

    it('project explicitly excluded in env', () => {
      const envConfig: ActivityConfig = {
        ...ENV_CONFIG,
        projectsExcludedFromAPI: ['project'],
      }

      const result = shouldIncludeProject(
        ProjectId('project'),
        envConfig,
        Logger.SILENT,
      )
      expect(result).toEqual(false)
    })
  })
})
