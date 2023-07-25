import { Logger } from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { ActivityConfig } from '../../config/Config'
import { TransactionCounter } from '../../core/activity/TransactionCounter'
import { SequenceProcessor } from '../../core/SequenceProcessor'
import { Project } from '../../model'
import { createActivityModule, shouldCounterBeIncluded } from './ActivityModule'

const PROJECT: Project = {
  projectId: ProjectId('project'),
  type: 'layer2',
  escrows: [],
  transactionApi: {
    type: 'rpc',
  },
}
const COUNTER = new TransactionCounter(
  ProjectId('project'),
  mockObject<SequenceProcessor>(),
  mockFn(),
)

const ENV_CONFIG: ActivityConfig = {
  starkexApiKey: 'key',
  starkexCallsPerMinute: 1,
  skipExplicitExclusion: false,
  projectsExcludedFromAPI: [],
  projects: {},
}

describe(createActivityModule.name, () => {
  describe(shouldCounterBeIncluded.name, () => {
    it('include counter there is no exclusion rule', () => {
      const projects: Project[] = [PROJECT]

      const result = shouldCounterBeIncluded(
        COUNTER,
        projects,
        ENV_CONFIG,
        Logger.SILENT,
      )
      expect(result).toEqual(true)
    })
    it('counter explicitly excluded in config', () => {
      const projects: Project[] = [
        {
          ...PROJECT,
          transactionApi: {
            type: 'rpc',
            excludeFromActivityApi: true,
          },
        },
      ]

      const result = shouldCounterBeIncluded(
        COUNTER,
        projects,
        ENV_CONFIG,
        Logger.SILENT,
      )
      expect(result).toEqual(false)
    })
    it('counter explicitly excluded in env', () => {
      const projects: Project[] = [PROJECT]

      const envConfig: ActivityConfig = {
        ...ENV_CONFIG,
        projectsExcludedFromAPI: ['project'],
      }

      const result = shouldCounterBeIncluded(
        COUNTER,
        projects,
        envConfig,
        Logger.SILENT,
      )
      expect(result).toEqual(false)
    })
    it('skip explicit exclusion', () => {
      const projects: Project[] = [
        {
          ...PROJECT,
          transactionApi: {
            type: 'rpc',
            excludeFromActivityApi: true,
          },
        },
      ]

      const envConfig: ActivityConfig = {
        ...ENV_CONFIG,
        skipExplicitExclusion: true,
      }

      const result = shouldCounterBeIncluded(
        COUNTER,
        projects,
        envConfig,
        Logger.SILENT,
      )
      expect(result).toEqual(true)
    })
  })
})
