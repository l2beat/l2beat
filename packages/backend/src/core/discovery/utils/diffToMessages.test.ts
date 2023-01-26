import { EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { FieldDiff } from './diffContracts'
import { DiscoveryDiff } from './diffDiscovery'
import {
  bundleMessages,
  contractDiffToMessages,
  diffToMessages,
  fieldDiffToMessage,
  wrapBoldAndItalic,
  wrapDiffCodeBlock,
} from './diffToMessages'

const ADDRESS = EthereumAddress('0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01')
const PROJECT = 'system'

describe('Discord message formatting', () => {
  describe(diffToMessages.name, () => {
    it('correctly formats a message', () => {
      const name = 'system'
      const diff: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address: ADDRESS,
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
          type: 'deleted',
        },
        {
          name: 'Contract',
          address: ADDRESS,
          type: 'created',
        },
      ]

      const result = diffToMessages(name, diff)

      const expected = [
        `***${name}*** | detected changes\`\`\`diff`,
        '\n',
        contractDiffToMessages(diff[0])[0],
        contractDiffToMessages(diff[1])[0],
        contractDiffToMessages(diff[2])[0],
        '```',
      ]

      expect(result).toEqual([expected.join('')])
    })

    it('truncates message larger than 2000 characters', () => {
      const name = 'system'
      const diff: DiscoveryDiff = {
        name: 'Contract',
        address: ADDRESS,
        type: 'deleted',
      }
      const differences: DiscoveryDiff[] = []

      while (differences.length < 27) {
        differences.push(diff)
      }

      const result = diffToMessages(name, differences)

      const firstPart = [
        `***${name}*** | detected changes\`\`\`diff\n`,
        differences.slice(0, 26).map(contractDiffToMessages).join(''),
        '```',
      ]

      const secondPart = [
        `***${name}*** | detected changes\`\`\`diff\n`,
        differences.slice(26).map(contractDiffToMessages).join(''),
        '```',
      ]

      expect(result).toEqual([firstPart.join(''), secondPart.join('')])
      expect(firstPart.join('').length).toEqual(1992)
      expect(secondPart.join('').length).toEqual(117)
    })

    it('truncates contract with diff larger than 2000 characters', () => {
      const diff: FieldDiff[] = []

      while (diff.length < 200) {
        diff.push({
          key: 'a',
          before: 'true',
          after: 'false',
        })
      }

      const contractDiff: DiscoveryDiff = {
        name: 'Contract',
        address: ADDRESS,
        diff,
      }

      const firstPart = [
        `***${PROJECT}*** | detected changes\`\`\`diff\n`,
        'Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n\n',
        diff.slice(0, 105).map(fieldDiffToMessage).join(''),
        '```',
      ]

      const secondPart = [
        `***${PROJECT}*** | detected changes\`\`\`diff\n`,
        'Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n\n',
        diff.slice(105).map(fieldDiffToMessage).join(''),
        '```',
      ]

      const result = diffToMessages(PROJECT, [contractDiff])

      expect(result).toEqual([firstPart.join(''), secondPart.join('')])
      expect(firstPart.join('').length).toEqual(1987)
      expect(secondPart.join('').length).toEqual(1807)
    })
  })

  describe(contractDiffToMessages.name, () => {
    it('values edited', () => {
      const diff: DiscoveryDiff = {
        name: 'Contract',
        address: ADDRESS,
        diff: [
          {
            key: 'count',
            before: '1',
            after: '2',
          },
          {
            key: 'important',
            before: 'true',
          },
          {
            key: 'new',
            after: 'true',
          },
        ],
      }

      const result = contractDiffToMessages(diff)

      const expected = [
        `Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n\n`,
        `count\n`,
        `- 1\n`,
        `+ 2\n\n`,
        `important\n`,
        `- true\n\n`,
        `new\n`,
        `+ true\n\n`,
      ]

      expect(result).toEqual([expected.join('')])
    })

    it('contract deleted', () => {
      const diff: DiscoveryDiff = {
        name: 'Contract',
        address: ADDRESS,
        type: 'deleted',
      }

      const result = contractDiffToMessages(diff)

      const expected = `- Deleted contract: Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n\n`

      expect(result).toEqual([expected])
    })

    it('contract created', () => {
      const diff: DiscoveryDiff = {
        name: 'Contract',
        address: ADDRESS,
        type: 'created',
      }

      const result = contractDiffToMessages(diff)

      const expected = `+ New contract: Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n\n`

      expect(result).toEqual([expected])
    })
  })

  describe(bundleMessages.name, () => {
    it('correctly groups messages into bundles smaller than maxLength', () => {
      const messages = [
        'a'.repeat(500),
        'a'.repeat(1000),
        'a'.repeat(1000),
        'a'.repeat(1000),
      ]
      const maxLength = 2000

      const result = bundleMessages(messages, maxLength)

      expect(result).toEqual(['a'.repeat(1500), 'a'.repeat(2000)])
    })
  })

  describe(fieldDiffToMessage.name, () => {
    it('correctly formats diff', () => {
      const diff: FieldDiff = {
        key: 'count',
        before: '1',
        after: '2',
      }

      const result = fieldDiffToMessage(diff)

      expect(result).toEqual('count\n- 1\n+ 2\n\n')
    })
  })

  describe(wrapDiffCodeBlock.name, () => {
    it('wraps content correctly', () => {
      const messages = 'a\nb\nc'

      const expected = '```diff\na\nb\nc```'

      const result = wrapDiffCodeBlock(messages)

      expect(result).toEqual(expected)
    })
  })

  describe(wrapBoldAndItalic.name, () => {
    it('wraps content correctly', () => {
      const content = 'projectName'

      const result = wrapBoldAndItalic(content)

      expect(result).toEqual(`***${content}***`)
    })
  })
})
