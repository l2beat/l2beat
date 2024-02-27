import { DiscoveryDiff, FieldDiff } from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { sum } from 'lodash'

import { MAX_MESSAGE_LENGTH } from '../../../peripherals/discord/DiscordClient'
import {
  bundleMessages,
  contractDiffToMessages,
  diffToMessages,
  fieldDiffToMessage,
  formatNonce,
  wrapBoldAndItalic,
  wrapDiffCodeBlock,
  wrapItalic,
} from './diffToMessages'

const ADDRESS = EthereumAddress('0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01')
const PROJECT = 'system'
const BLOCK_NUMBER = 123456789

const EMPTY_DISCOVERY_META = {
  contracts: [],
}

describe('Discord message formatting', () => {
  describe(diffToMessages.name, () => {
    it('correctly formats a message', () => {
      const name = 'system'
      const dependents: string[] = []
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

      const result = diffToMessages(
        name,
        diff,
        EMPTY_DISCOVERY_META,
        BLOCK_NUMBER,
        'ethereum',
        dependents,
      )

      const expected = [
        `***${name}*** | detected changes on chain: ***ethereum***\`\`\`diff`,
        '\n',
        contractDiffToMessages(diff[0], undefined)[0],
        contractDiffToMessages(diff[1], undefined)[0],
        contractDiffToMessages(diff[2], undefined)[0],
        '```',
      ]

      expect(result).toEqual([expected.join('')])
    })

    it('adds dependence message', () => {
      const name = 'module'
      const dependents: string[] = ['system1', 'system2']
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

      const result = diffToMessages(
        name,
        diff,
        EMPTY_DISCOVERY_META,
        BLOCK_NUMBER,
        'ethereum',
        dependents,
      )

      const expected = [
        `***${name}*** | detected changes on chain: ***ethereum***\n`,
        wrapItalic('This is a shared module, used by the following projects:'),
        ' ',
        wrapBoldAndItalic('system1, system2.'),
        '```diff',
        '\n',
        contractDiffToMessages(diff[0], undefined)[0],
        contractDiffToMessages(diff[1], undefined)[0],
        contractDiffToMessages(diff[2], undefined)[0],
        '```',
      ]

      expect(result).toEqual([expected.join('')])
    })

    it('truncates message larger than 2000 characters', () => {
      const name = 'system'
      const dependents: string[] = []
      const diff: DiscoveryDiff = {
        name: 'Contract',
        address: ADDRESS,
        type: 'deleted',
      }
      const differences: DiscoveryDiff[] = []
      const nonce = 1

      while (differences.length < 27) {
        differences.push(diff)
      }

      const result = diffToMessages(
        name,
        differences,
        EMPTY_DISCOVERY_META,
        BLOCK_NUMBER,
        'ethereum',
        dependents,
        nonce,
      )

      const firstPart = [
        `> ${formatNonce(
          nonce,
        )} (block_number=${BLOCK_NUMBER})\n\n***${name}*** | detected changes on chain: ***ethereum***\`\`\`diff\n`,
        differences.slice(0, 25).map(d => contractDiffToMessages(d, undefined)).join(''),
        '```',
      ]

      const secondPart = [
        `> ${formatNonce(
          nonce,
        )} (block_number=${BLOCK_NUMBER})\n\n***${name}*** | detected changes on chain: ***ethereum***\`\`\`diff\n`,
        differences.slice(25).map(d => contractDiffToMessages(d, undefined)).join(''),
        '```',
      ]

      expect(result).toEqual([firstPart.join(''), secondPart.join('')])
      expect(firstPart.join('').length).toEqual(1976)
      expect(secondPart.join('').length).toEqual(251)
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
      const nonce = 1

      const firstPart = [
        `> ${formatNonce(
          nonce,
        )} (block_number=${BLOCK_NUMBER})\n\n***${PROJECT}*** | detected changes on chain: ***ethereum***\`\`\`diff\n`,
        'Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n+++ description: None\n\n',
        diff
          .slice(0, 101)
          .map((d) => fieldDiffToMessage(d, undefined))
          .join(''),
        '```',
      ]

      const secondPart = [
        `> ${formatNonce(
          nonce,
        )} (block_number=${BLOCK_NUMBER})\n\n***${PROJECT}*** | detected changes on chain: ***ethereum***\`\`\`diff\n`,
        'Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n+++ description: None\n\n',
        diff
          .slice(101)
          .map((d) => fieldDiffToMessage(d, undefined))
          .join(''),
        '```',
      ]

      const result = diffToMessages(
        PROJECT,
        [contractDiff],
        EMPTY_DISCOVERY_META,
        BLOCK_NUMBER,
        'ethereum',
        [],
        nonce,
      )

      expect(result).toEqual([firstPart.join(''), secondPart.join('')])
      expect(firstPart.join('').length).toEqual(1996)
      expect(secondPart.join('').length).toEqual(1960)
    })

    it('truncates contract with diff larger than 2000 characters from a single change', () => {
      const diff: FieldDiff[] = [
        {
          key: 'a',
          before: 'A'.repeat(1000),
          after: 'B'.repeat(1000),
        },
      ]

      const contractDiff: DiscoveryDiff = {
        name: 'Contract',
        address: ADDRESS,
        diff,
      }
      const nonce = 1

      const part = [
        `> ${formatNonce(
          nonce,
        )} (block_number=${BLOCK_NUMBER})\n\n***${PROJECT}*** | detected changes on chain: ***ethereum***\`\`\`diff\n`,
        'Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n+++ description: None\n\n',
        '', // placeholder, replaced lower down
        '```',
      ]

      const overheadLength = sum(part.map((e) => e.length))
      part[2] = diff
        .map((d) => fieldDiffToMessage(d, undefined, MAX_MESSAGE_LENGTH - overheadLength))
        .join('')

      const result = diffToMessages(
        PROJECT,
        [contractDiff],
        EMPTY_DISCOVERY_META,
        BLOCK_NUMBER,
        'ethereum',
        [],
        nonce,
      )

      expect(result).toEqual([part.join('')])
      expect(result.length).toEqual(1)
      expect(result[0].length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH)
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

      const result = contractDiffToMessages(diff, undefined)

      const expected = [
        `Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n`,
        `+++ description: None\n\n`,
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

      const result = contractDiffToMessages(diff, undefined)

      const expected = `- Deleted contract: Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n\n`

      expect(result).toEqual([expected])
    })

    it('contract created', () => {
      const diff: DiscoveryDiff = {
        name: 'Contract',
        address: ADDRESS,
        type: 'created',
      }

      const result = contractDiffToMessages(diff, undefined)

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

      const result = fieldDiffToMessage(diff, undefined)

      expect(result).toEqual('count\n- 1\n+ 2\n\n')
    })

    it('handles undefined before', () => {
      const undefinedBefore: FieldDiff = {
        key: 'count',
        before: undefined,
      }
      const result = fieldDiffToMessage(undefinedBefore, undefined)
      expect(result).toEqual('count\n- undefined\n\n')
    })

    it('handles undefined after', () => {
      const undefinedAfter: FieldDiff = {
        key: 'count',
        after: undefined,
      }

      const result2 = fieldDiffToMessage(undefinedAfter, undefined)
      expect(result2).toEqual('count\n+ undefined\n\n')
    })
  })

  describe(formatNonce.name, () => {
    it('one digit nonce', () => {
      const nonce = 1

      const result = formatNonce(nonce)

      expect(result).toEqual('#0001')
    })

    it('two digit nonce', () => {
      const nonce = 10

      const result = formatNonce(nonce)

      expect(result).toEqual('#0010')
    })

    it('three digit nonce', () => {
      const nonce = 100

      const result = formatNonce(nonce)

      expect(result).toEqual('#0100')
    })

    it('four digit nonce', () => {
      const nonce = 1000

      const result = formatNonce(nonce)

      expect(result).toEqual('#1000')
    })

    it('five digit nonce', () => {
      const nonce = 10000

      const result = formatNonce(nonce)

      expect(result).toEqual('#10000')
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

  describe(wrapItalic.name, () => {
    it('wraps content correctly', () => {
      const content = 'projectName'

      const result = wrapItalic(content)

      expect(result).toEqual(`*${content}*`)
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
