import type { Formula } from '@l2beat/config'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { collectActiveLeaves, collectScheduledLeaves } from './formulas'
import {
  ARB_USDC,
  ARB_USDC_E,
  ESCROW,
  escrow,
  L1_USDC,
  NOW,
  supply,
} from './test/fixtures'

describe(collectActiveLeaves.name, () => {
  it('collects the deployments and escrows of active formulas', () => {
    const leaves = collectActiveLeaves(
      sum(
        escrow('ethereum', L1_USDC),
        {
          type: 'balanceOfEscrows',
          chain: 'ethereum',
          address: 'native',
          escrowAddresses: [
            EthereumAddress('0x2222222222222222222222222222222222222222'),
          ],
          decimals: 18,
          sinceTimestamp: UnixTime(1),
        },
        supply('arbitrum', ARB_USDC),
        { type: 'const', value: '1', decimals: 0, sinceTimestamp: 1 },
      ),
      NOW,
    )

    expect(leaves).toEqual([
      { chain: 'ethereum', address: L1_USDC, escrowAddresses: [ESCROW] },
      {
        chain: 'ethereum',
        address: 'native',
        escrowAddresses: ['0x2222222222222222222222222222222222222222'],
      },
      { chain: 'arbitrum', address: ARB_USDC, escrowAddresses: [] },
    ])
  })

  it('skips formulas that are not active yet or anymore', () => {
    const active = supply('base', L1_USDC, { since: 100, until: 300 })
    const expired = supply('base', ARB_USDC, { since: 100, until: 200 })
    const future = supply('base', ARB_USDC_E, { since: 200 })

    expect(
      collectActiveLeaves(sum(active, expired, future), UnixTime(200)).map(
        (leaf) => leaf.address,
      ),
    ).toEqual([L1_USDC])
  })

  it('counts the minuend of a diff, like the TVS runtime', () => {
    const minuend = supply('base', L1_USDC, { since: 100 })
    const subtrahend = escrow('base', L1_USDC, { since: 300 })

    expect(
      collectActiveLeaves(diff(minuend, subtrahend), UnixTime(200)),
    ).toEqual([{ chain: 'base', address: L1_USDC, escrowAddresses: [] }])
    expect(
      collectActiveLeaves(diff(subtrahend, minuend), UnixTime(200)),
    ).toEqual([])
  })
})

describe(collectScheduledLeaves.name, () => {
  it('collects counted deployments that start later', () => {
    const counted = supply('base', L1_USDC, { since: 300 })
    const subtracted = escrow('base', ARB_USDC, { since: 300 })

    expect(
      collectScheduledLeaves(diff(counted, subtracted), UnixTime(200)).map(
        (leaf) => leaf.address,
      ),
    ).toEqual([L1_USDC])
  })
})

function sum(...args: Formula[]): Formula {
  return { type: 'calculation', operator: 'sum', arguments: args }
}

function diff(...args: Formula[]): Formula {
  return { type: 'calculation', operator: 'diff', arguments: args }
}
