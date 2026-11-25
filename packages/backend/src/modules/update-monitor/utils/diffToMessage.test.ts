import { type DiscoveryDiff, discoveryDiffToMarkdown } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { diffToMessage } from './diffToMessage'

const ADDRESS = ChainSpecificAddress(
  'eth:0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01',
)
const BLOCK_NUMBER = 123456789

describe('Discord message formatting', () => {
  describe(diffToMessage.name, () => {
    it('correctly formats a message', () => {
      const name = 'system'
      const dependents: string[] = []
      const diff: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address: ADDRESS,
          addressType: 'Contract',
          diff: [
            {
              key: 'count',
              before: '1',
              after: '2',
            },
          ],
        },
        {
          name: 'Contract',
          address: ADDRESS,
          addressType: 'Contract',
          type: 'deleted',
        },
        {
          name: 'Contract',
          address: ADDRESS,
          addressType: 'Contract',
          type: 'created',
        },
      ]

      const result = diffToMessage(name, diff, BLOCK_NUMBER, dependents)

      const expected = [
        '***system*** | detected changes',
        discoveryDiffToMarkdown(diff),
      ]

      expect(result).toEqual(expected.join(''))
    })

    it('adds dependence message', () => {
      const name = 'module'
      const dependents: string[] = ['system1', 'system2']
      const diff: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address: ADDRESS,
          addressType: 'Contract',
          diff: [
            {
              key: 'count',
              before: '1',
              after: '2',
            },
          ],
        },
        {
          name: 'Contract',
          address: ADDRESS,
          addressType: 'Contract',
          type: 'deleted',
        },
        {
          name: 'Contract',
          address: ADDRESS,
          addressType: 'Contract',
          type: 'created',
        },
      ]

      const result = diffToMessage(name, diff, BLOCK_NUMBER, dependents)

      const expected = [
        '***module*** | detected changes\n',
        '*This module is referenced by the following projects:*',
        ' ',
        '***system1, system2.***',
        discoveryDiffToMarkdown(diff),
      ]

      expect(result).toEqual(expected.join(''))
    })
  })
})
