import { EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { DiscoveryDiff } from './diffDiscovery'
import {
  diffToMessages,
  diffToString,
  wrapBoldAndItalic,
  wrapDiffCodeBlock,
} from './diffToMessages'

const ADDRESS = EthereumAddress('0x94cA7e313287a0C4c35AD4c243D1B2f3f6557D01')

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
      diffToString(diff[0]),
      '\n',
      diffToString(diff[1]),
      '\n',
      diffToString(diff[2]),
      '\n',
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
      differences.slice(0, 26).map(diffToString).join('\n'),
      '\n```',
    ]

    const secondPart = [
      `***${name}*** | detected changes\`\`\`diff\n`,
      differences.slice(26).map(diffToString).join('\n'),
      '\n```',
    ]

    expect(result).toEqual([firstPart.join(''), secondPart.join('')])
    expect(firstPart.join('').length).toEqual(1992)
    expect(secondPart.join('').length).toEqual(117)
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
