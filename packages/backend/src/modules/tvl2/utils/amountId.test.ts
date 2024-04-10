import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { createAmountId } from './amountId'

describe(createAmountId.name, () => {
  it('works for totalSupply', () => {
    expect(
      createAmountId('chain', ProjectId('projectId'), {
        type: 'totalSupply',
        address: 'address',
      }),
    ).toEqual('88f4c5c9a84c')
  })

  it('works for circulatingSupply', () => {
    expect(
      createAmountId('chain', ProjectId('projectId'), {
        type: 'circulatingSupply',
        address: 'address',
        coingeckoId: 'coingeckoId',
      }),
    ).toEqual('bd311ede8f4c')
  })

  it('works for escrow', () => {
    expect(
      createAmountId('chain', ProjectId('projectId'), {
        type: 'escrow',
        address: 'address',
        escrowAddress: 'escrowAddress',
      }),
    ).toEqual('25188634c56f')
  })

  it('changes with projectId', () => {
    expect(
      createAmountId('chain', ProjectId('projectId2'), {
        type: 'totalSupply',
        address: 'address',
      }),
    ).not.toEqual(
      createAmountId('chain', ProjectId('projectId'), {
        type: 'totalSupply',
        address: 'address',
      }),
    )
  })

  it('changes with chain', () => {
    expect(
      createAmountId('chain2', ProjectId('projectId'), {
        type: 'totalSupply',
        address: 'address',
      }),
    ).not.toEqual(
      createAmountId('chain', ProjectId('projectId'), {
        type: 'totalSupply',
        address: 'address',
      }),
    )
  })

  it('changes with type', () => {
    expect(
      createAmountId('chain', ProjectId('projectId'), {
        type: 'totalSupply',
        address: 'address',
      }),
    ).not.toEqual(
      createAmountId('chain', ProjectId('projectId'), {
        type: 'escrow',
        address: 'address',
        escrowAddress: 'escrowAddress',
      }),
    )
  })
})
