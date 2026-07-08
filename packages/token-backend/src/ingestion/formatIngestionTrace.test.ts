import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { formatIngestionTrace } from './formatIngestionTrace'
import type { IngestionTrace } from './IngestionTrace'

describe(formatIngestionTrace.name, () => {
  it('renders the address, every step and the outcome as text', () => {
    const trace: IngestionTrace = {
      id: 'ing_test',
      address: { chain: 'ethereum', address: '0xaaa' },
      existingDeployedToken: undefined,
      steps: [
        { kind: 'no-existing-token' },
        {
          kind: 'transfer-evidence',
          total: 3,
          nonSwapping: 2,
          abstractTokens: [{ id: 'USDC01', symbol: 'USDC' }],
        },
        {
          kind: 'resolved-from-transfers',
          abstractToken: { id: 'USDC01', symbol: 'USDC' },
        },
      ],
      outcome: {
        kind: 'write',
        newAbstractToken: undefined,
        deployedToken: {
          type: 'insert',
          record: {
            chain: 'ethereum',
            address: '0xaaa',
            abstractTokenId: 'USDC01',
            symbol: 'USDC',
            decimals: 6,
            deploymentTimestamp: UnixTime(1),
            comment: null,
            metadata: null,
          },
        },
        tokenRelations: [],
        neighborsToEnqueue: [],
      },
    }

    const log = formatIngestionTrace(trace)

    expect(log).toEqual(
      [
        'Ingestion ID: ing_test',
        'Address: ethereum:0xaaa',
        '1. No existing deployed token in TokenDB.',
        '2. Found 3 transfers (2 non-swapping). Other sides resolve to: USDC01:USDC.',
        '3. Resolved abstract token USDC01:USDC from non-swapping transfers.',
        'Outcome: write — insert deployed token ethereum:0xaaa (abstract: USDC01).',
      ].join('\n'),
    )
  })

  it('handles conflict outcomes', () => {
    const trace: IngestionTrace = {
      id: 'ing_test',
      address: { chain: 'ethereum', address: '0xbbb' },
      existingDeployedToken: undefined,
      steps: [{ kind: 'no-existing-token' }],
      outcome: { kind: 'conflict', message: 'multiple abstracts' },
    }

    expect(
      formatIngestionTrace(trace).includes(
        'Outcome: conflict — multiple abstracts',
      ),
    ).toEqual(true)
  })

  it('renders discovered token relations in steps and write outcomes', () => {
    const trace: IngestionTrace = {
      id: 'ing_test',
      address: { chain: 'ethereum', address: '0xaaa' },
      existingDeployedToken: undefined,
      steps: [
        {
          kind: 'relations-discovered',
          relations: [
            {
              tokenFromChain: 'ethereum',
              tokenFromAddress: '0xaaa',
              tokenToChain: 'base',
              tokenToAddress: '0xbbb',
              plugin: 'test-plugin',
              sourceWasBurned: true,
              destinationWasMinted: true,
              bridgeType: 'burnAndMint',
              transfer: { transferId: 'transfer-id' },
            },
          ],
        },
      ],
      outcome: {
        kind: 'write',
        newAbstractToken: undefined,
        deployedToken: undefined,
        tokenRelations: [
          {
            tokenFromChain: 'ethereum',
            tokenFromAddress: '0xaaa',
            tokenToChain: 'base',
            tokenToAddress: '0xbbb',
            plugin: 'test-plugin',
            sourceWasBurned: true,
            destinationWasMinted: true,
            bridgeType: 'burnAndMint',
            transfer: { transferId: 'transfer-id' },
          },
        ],
        neighborsToEnqueue: [],
      },
    }

    expect(formatIngestionTrace(trace)).toEqual(
      [
        'Ingestion ID: ing_test',
        'Address: ethereum:0xaaa',
        '1. Will add 1 token relation(s): ethereum:0xaaa -> base:0xbbb via test-plugin.',
        'Outcome: write — no deployed-token changes. Add 1 token relation(s).',
      ].join('\n'),
    )
  })
})
