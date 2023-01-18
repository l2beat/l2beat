import { EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { DiscoveryDiff } from './diffDiscovery'
import { diffToMessage, diffToString } from './diffToMessage'

const ADDRESS = EthereumAddress('0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01')

describe(diffToMessage.name, () => {
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

    const result = diffToMessage(name, diff)

    const expected = [
      `Detected changes for ${name}\n\n`,
      '```diff',
      '\n',
      diffToString(diff[0]),
      '\n',
      diffToString(diff[1]),
      '\n',
      diffToString(diff[2]),
      '\n',
      '```',
    ]

    expect(result).toEqual(expected.join(''))
  })
})

describe(diffToString.name, () => {
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

    const result = diffToString(diff)

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

    expect(result).toEqual(expected.join(''))
  })

  it('contract deleted', () => {
    const diff: DiscoveryDiff = {
      name: 'Contract',
      address: ADDRESS,
      type: 'deleted',
    }

    const result = diffToString(diff)

    const expected = `- Deleted contract: Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n`

    expect(result).toEqual(expected)
  })

  it('contract created', () => {
    const diff: DiscoveryDiff = {
      name: 'Contract',
      address: ADDRESS,
      type: 'created',
    }

    const result = diffToString(diff)

    const expected = `+ New contract: Contract | 0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01\n`

    expect(result).toEqual(expected)
  })
})
