import { EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { DiscoveryDiff } from './diffDiscovery'
import { diffToString } from './diffToString'

const ADDRESS = EthereumAddress.random()

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
      `\`\`\`diff\n${diff.name} | ${diff.address.toString()}\n\n`,
      `count\n-1\n+2\n\n`,
      `important\n-true\n\n`,
      `new\n+true\n\n`,
      `\`\`\``,
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

    const expected = `\`\`\`diff\n-Deleted contract: ${
      diff.name
    } | ${diff.address.toString()}\n\`\`\``

    expect(result).toEqual(expected)
  })

  it('contract created', () => {
    const diff: DiscoveryDiff = {
      name: 'Contract',
      address: ADDRESS,
      type: 'created',
    }

    const result = diffToString(diff)

    const expected = `\`\`\`diff\n+New contract: ${
      diff.name
    } | ${diff.address.toString()}\n\`\`\``

    expect(result).toEqual(expected)
  })
})
