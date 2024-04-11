import {
  AmountConfigEntry,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { createAmountId } from './createAmountId'

describe(createAmountId.name, () => {
  it('works for totalSupply', () => {
    expect(
      createAmountId(
        mockObject<AmountConfigEntry>({
          chain: 'chain',
          project: ProjectId('projectId'),
          type: 'totalSupply',
          address: EthereumAddress.unsafe('address'),
        }),
      ),
    ).toEqual('88f4c5c9a84c')
  })

  it('works for circulatingSupply', () => {
    expect(
      createAmountId(
        mockObject<AmountConfigEntry>({
          chain: 'chain',
          project: ProjectId('projectId'),
          type: 'circulatingSupply',
          address: EthereumAddress.unsafe('address'),
          coingeckoId: CoingeckoId('coingeckoId'),
        }),
      ),
    ).toEqual('bd311ede8f4c')
  })

  it('works for escrow', () => {
    expect(
      createAmountId(
        mockObject<AmountConfigEntry>({
          chain: 'chain',
          project: ProjectId('projectId'),
          type: 'escrow',
          address: EthereumAddress.unsafe('address'),
          escrowAddress: EthereumAddress.unsafe('escrowAddress'),
        }),
      ),
    ).toEqual('25188634c56f')
  })

  it('changes with projectId', () => {
    expect(
      createAmountId(
        mockObject<AmountConfigEntry>({
          chain: 'chain',
          project: ProjectId('projectId2'),
          type: 'totalSupply',
          address: EthereumAddress.unsafe('address'),
        }),
      ),
    ).not.toEqual(
      createAmountId(
        mockObject<AmountConfigEntry>({
          chain: 'chain',
          project: ProjectId('projectId'),
          type: 'totalSupply',
          address: EthereumAddress.unsafe('address'),
        }),
      ),
    )
  })

  it('changes with chain', () => {
    expect(
      createAmountId(
        mockObject<AmountConfigEntry>({
          chain: 'chain2',
          project: ProjectId('projectId'),
          type: 'totalSupply',
          address: EthereumAddress.unsafe('address'),
        }),
      ),
    ).not.toEqual(
      createAmountId(
        mockObject<AmountConfigEntry>({
          chain: 'chain',
          project: ProjectId('projectId'),
          type: 'totalSupply',
          address: EthereumAddress.unsafe('address'),
        }),
      ),
    )
  })

  it('changes with type', () => {
    expect(
      createAmountId(
        mockObject<AmountConfigEntry>({
          chain: 'chain',
          project: ProjectId('projectId'),
          type: 'totalSupply',
          address: EthereumAddress.unsafe('address'),
        }),
      ),
    ).not.toEqual(
      createAmountId(
        mockObject<AmountConfigEntry>({
          chain: 'chain',
          project: ProjectId('projectId'),
          type: 'escrow',
          address: EthereumAddress.unsafe('address'),
          escrowAddress: EthereumAddress.unsafe('escrowAddress'),
        }),
      ),
    )
  })
})
