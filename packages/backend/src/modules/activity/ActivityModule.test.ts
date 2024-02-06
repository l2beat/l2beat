import { Logger } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { ActivityConfig } from '../../config/Config'
import { SequenceProcessor } from '../../core/activity/SequenceProcessor'
import { TransactionCounter } from '../../core/activity/TransactionCounter'
import { createActivityModule, shouldCounterBeIncluded } from './ActivityModule'

const COUNTER = new TransactionCounter(
  ProjectId('project'),
  mockObject<SequenceProcessor>(),
  mockFn(),
)

const ENV_CONFIG: ActivityConfig = {
  starkexApiKey: 'key',
  starkexCallsPerMinute: 1,
  projectsExcludedFromAPI: [],
  projects: [],
}

describe(createActivityModule.name, () => {
  describe(shouldCounterBeIncluded.name, () => {
    it('include counter there is no exclusion rule', () => {
      const result = shouldCounterBeIncluded(COUNTER, ENV_CONFIG, Logger.SILENT)
      expect(result).toEqual(true)
    })

    it('counter explicitly excluded in env', () => {
      const envConfig: ActivityConfig = {
        ...ENV_CONFIG,
        projectsExcludedFromAPI: ['project'],
      }

      const result = shouldCounterBeIncluded(COUNTER, envConfig, Logger.SILENT)
      expect(result).toEqual(false)
    })
  })
})
