import {
  EthereumAddress,
  hashJson,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessFunctionCall, LivenessTransfer } from './LivenessConfig'
import { LivenessConfigurationIdentifier } from './LivenessConfigurationIdentifier'

describe(LivenessConfigurationIdentifier.name, () => {
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
      ]) as unknown as LivenessConfigurationIdentifier

      expect(LivenessConfigurationIdentifier(config)).toEqual(expected)
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
      ]) as unknown as LivenessConfigurationIdentifier

      expect(LivenessConfigurationIdentifier(config)).toEqual(expected)
    })
  })
})
