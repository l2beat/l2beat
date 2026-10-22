import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import { findFrontierReferrers } from './printFrontier'

describe(findFrontierReferrers.name, () => {
  const HUB = ChainSpecificAddress.random()
  const SIDE = ChainSpecificAddress.random()
  const OWNER = ChainSpecificAddress.random()
  const B = ChainSpecificAddress.random()
  const C = ChainSpecificAddress.random()
  const D = ChainSpecificAddress.random()

  it('names the fields whose followed values lead past maxDepth', () => {
    const referrers = findFrontierReferrers(
      [
        {
          ...EMPTY_ANALYZED_CONTRACT,
          address: HUB,
          name: 'Hub',
          values: { router: B, tokens: [C, D, C], owner: OWNER },
          relatives: {
            [B.toString()]: new Set(),
            [C.toString()]: new Set(),
            [D.toString()]: new Set(),
            [OWNER.toString()]: new Set(),
          },
          followedFields: ['router', 'tokens', 'owner'],
        },
        {
          ...EMPTY_ANALYZED_CONTRACT,
          address: SIDE,
          name: 'Side',
          values: { ignored: D },
          relatives: {},
        },
        {
          type: 'Reference',
          name: 'Elsewhere',
          address: OWNER,
          targetType: 'Contract',
          targetProject: 'other',
        },
      ],
      [B, C, D],
    )

    expect(referrers).toEqual([
      {
        address: HUB,
        name: 'Hub',
        fields: [
          { field: 'router', addresses: [B] },
          { field: 'tokens', addresses: [C, D] },
        ],
      },
    ])
  })

  it('leaves out an ignored field that holds an address a followed field leads to', () => {
    const referrers = findFrontierReferrers(
      [
        {
          ...EMPTY_ANALYZED_CONTRACT,
          address: HUB,
          name: 'Hub',
          values: { router: B, backupRouter: B },
          relatives: { [B.toString()]: new Set() },
          followedFields: ['router'],
        },
      ],
      [B],
    )

    expect(referrers).toEqual([
      {
        address: HUB,
        name: 'Hub',
        fields: [{ field: 'router', addresses: [B] }],
      },
    ])
  })
})
