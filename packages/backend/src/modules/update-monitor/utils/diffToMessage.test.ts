import {
  DiscoveryConfig,
  DiscoveryDiff,
  discoveryDiffToMarkdown,
} from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  diffToMessage,
  formatNonce,
  wrapBoldAndItalic,
  wrapDiffCodeBlock,
  wrapItalic,
} from './diffToMessage'

const ADDRESS = EthereumAddress('0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01')
const BLOCK_NUMBER = 123456789

const EMPTY_DISCOVERY_CONFIG = new DiscoveryConfig({
  name: 'test',
  chain: 'ethereum',
  initialAddresses: [],
})

describe('Discord message formatting', () => {
  describe(diffToMessage.name, () => {
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

      const result = diffToMessage(
        name,
        diff,
        EMPTY_DISCOVERY_CONFIG,
        BLOCK_NUMBER,
        'ethereum',
        dependents,
      )

      const expected = [
        `***${name}*** | detected changes on chain: ***ethereum***`,
        discoveryDiffToMarkdown(diff, undefined),
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

      const result = diffToMessage(
        name,
        diff,
        EMPTY_DISCOVERY_CONFIG,
        BLOCK_NUMBER,
        'ethereum',
        dependents,
      )

      const expected = [
        `***${name}*** | detected changes on chain: ***ethereum***\n`,
        wrapItalic('This is a shared module, used by the following projects:'),
        ' ',
        wrapBoldAndItalic('system1, system2.'),
        discoveryDiffToMarkdown(diff, undefined),
      ]

      expect(result).toEqual(expected.join(''))
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
