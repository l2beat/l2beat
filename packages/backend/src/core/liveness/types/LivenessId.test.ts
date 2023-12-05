import { layer2s } from '@l2beat/config'
import {
  EthereumAddress,
  hashJson,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessConfigurationRecord } from '../../../peripherals/database/LivenessConfigurationRepository'
import { LivenessFunctionCall, LivenessTransfer } from './LivenessConfig'
import { InputType, LivenessId } from './LivenessId'

describe(LivenessId.name, () => {
  describe('calculates identifier for:', () => {
    it('transfer config', () => {
      const projectId = ProjectId('test')
      const type = LivenessType('STATE')
      const sinceTimestamp = new UnixTime(0)
      const from = EthereumAddress.random()
      const to = EthereumAddress.random()

      const config: LivenessTransfer = {
        livenessConfigurationId: Math.floor(Math.random() * 100),
        projectId,
        type,
        sinceTimestamp,
        from,
        to,
      }

      const expected = hashJson([
        projectId.toString(),
        type,
        sinceTimestamp.toString(),
        from.toString(),
        to.toString(),
      ]) as unknown as LivenessId

      expect(LivenessId(config)).toEqual(expected)
    })

    it('functionCall config', () => {
      const projectId = ProjectId('test')
      const type = LivenessType('STATE')
      const sinceTimestamp = new UnixTime(0)
      const address = EthereumAddress.random()
      const selector = '0x12345678'

      const config: LivenessFunctionCall = {
        livenessConfigurationId: Math.floor(Math.random() * 100),
        projectId,
        type,
        sinceTimestamp,
        address,
        selector,
      }

      const expected = hashJson([
        projectId.toString(),
        type,
        sinceTimestamp.toString(),
        address.toString(),
        selector,
      ]) as unknown as LivenessId

      expect(LivenessId(config)).toEqual(expected)
    })

    describe('calculates LivenessId for every project config', () => {
      const configs: InputType[] = []
      layer2s.forEach((project) => {
        if (project.config.liveness) {
          configs.push(
            ...project.config.liveness.batchSubmissions.map((x) => ({
              ...x,
              projectId: project.id,
              type: LivenessType('DA'),
            })),
          )
          configs.push(
            ...project.config.liveness.stateUpdates.map((x) => ({
              ...x,
              projectId: project.id,
              type: LivenessType('STATE'),
            })),
          )
        }
      })
      for (const config of configs) {
        it(`${config.projectId.toString()} ${config.type}`, () => {
          expect(LivenessId(config)).toBeA(String)
        })
      }
    })
  })

  describe(LivenessId.params.name, () => {
    it('transfer config', () => {
      const config = {
        projectId: ProjectId('test'),
        type: LivenessType('STATE'),
        sinceTimestamp: new UnixTime(0),
        from: EthereumAddress.random(),
        to: EthereumAddress.random(),
      }
      const params = LivenessId.params(config)

      expect(params).toEqual({
        from: config.from.toString(),
        to: config.to.toString(),
      })
    })
    it('functionCall config', () => {
      const config = {
        projectId: ProjectId('test'),
        type: LivenessType('DA'),
        sinceTimestamp: new UnixTime(0),
        address: EthereumAddress.random(),
        selector: '0x12345678',
      }
      const params = LivenessId.params(config)

      expect(params).toEqual({
        address: config.address.toString(),
        selector: config.selector,
      })
    })
  })

  describe(LivenessId.wasUpdated.name, () => {
    const testCases: {
      name: string
      before: UnixTime | undefined
      after: UnixTime | undefined
      expected: boolean
    }[] = [
      {
        name: 'no change | undefined',
        before: undefined,
        after: undefined,
        expected: false,
      },
      {
        name: 'no change | UnixTime',
        before: new UnixTime(0),
        after: new UnixTime(0),
        expected: false,
      },
      {
        name: 'from undefined to defined',
        before: undefined,
        after: new UnixTime(0),
        expected: true,
      },
      {
        name: 'from defined to undefined',
        before: new UnixTime(0),
        after: undefined,
        expected: true,
      },
      {
        name: 'from defined to defined',
        before: new UnixTime(0),
        after: new UnixTime(1),
        expected: true,
      },
    ]

    const BEFORE: LivenessConfigurationRecord = {
      id: 0,
      lastSyncedTimestamp: undefined,
      projectId: ProjectId('test'),
      type: LivenessType('STATE'),
      identifier: LivenessId.unsafe('test'),
      params: JSON.stringify({}),
      sinceTimestamp: new UnixTime(0),
    }

    const AFTER: LivenessTransfer = {
      projectId: ProjectId('test'),
      type: LivenessType('STATE'),
      from: EthereumAddress.random(),
      to: EthereumAddress.random(),
      sinceTimestamp: new UnixTime(0),
      livenessConfigurationId: 0,
    }

    for (const testCase of testCases) {
      it(testCase.name, () => {
        const before: LivenessConfigurationRecord = {
          ...BEFORE,
          untilTimestamp: testCase.before,
        }

        const after: LivenessTransfer = {
          ...AFTER,
          untilTimestamp: testCase.after,
        }

        expect(LivenessId.wasUpdated(before, after)).toEqual(testCase.expected)
      })
    }
  })
})
