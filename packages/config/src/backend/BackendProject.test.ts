import { assert } from '@l2beat/backend-tools'
import { layer2s } from '../projects/layer2s'

import {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxTransferConfig,
} from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { ScalingProjectEscrow } from '../common'
import { layer2ToBackendProject, mapTokens } from './BackendProject'

describe('BackendProject', () => {
  describe(mapTokens.name, () => {
    it('works for *', () => {
      const escrow = getMockEscrow({ tokens: '*', excludedTokens: ['B', 'D'] })

      const tokensOnChain: Token[] = [
        getMockToken({ symbol: 'A' }),
        getMockToken({ symbol: 'B' }),
        getMockToken({
          symbol: 'C',
          supply: 'preminted',
          escrow: escrow.address, // associated escrow - exclude
        }),
        getMockToken({
          symbol: 'D', // excluded token symbol - exclude
          supply: 'preminted',
          escrow: EthereumAddress.ZERO,
        }),
        getMockToken({
          symbol: 'E',
          supply: 'preminted',
          escrow: EthereumAddress.ZERO,
        }),
      ]

      const tokens = mapTokens(escrow, tokensOnChain)

      expect(tokens).toEqualUnsorted([
        getMockToken({ symbol: 'A' }),
        getMockToken({
          symbol: 'E',
          supply: 'preminted',
          escrow: EthereumAddress.ZERO,
        }),
      ])
    })
    it('works for list of symbols', () => {
      const escrow = getMockEscrow({
        tokens: ['A', 'B', 'C', 'D', 'E'],
        excludedTokens: ['B', 'D'],
      })

      const tokensOnChain: Token[] = [
        getMockToken({ symbol: 'A' }),
        getMockToken({ symbol: 'B' }),
        getMockToken({
          symbol: 'C',
          supply: 'preminted',
          escrow: escrow.address, // associated escrow - exclude
        }),
        getMockToken({
          symbol: 'D', // excluded token symbol - exclude
          supply: 'preminted',
          escrow: EthereumAddress.ZERO,
        }),
        getMockToken({
          symbol: 'E',
          supply: 'preminted',
          escrow: EthereumAddress.ZERO,
        }),
        getMockToken({ symbol: 'F' }), // not in the list - exclude
      ]

      const tokens = mapTokens(escrow, tokensOnChain)

      expect(tokens).toEqualUnsorted([
        getMockToken({ symbol: 'A' }),
        getMockToken({
          symbol: 'E',
          supply: 'preminted',
          escrow: EthereumAddress.ZERO,
        }),
      ])
    })
  })

  describe('Tracked transactions', () => {
    const projects = layer2s.map(layer2ToBackendProject)
    it('every TrackedTxId is unique', () => {
      const ids = new Set<string>()
      for (const project of projects) {
        const trackedTxsIds =
          project.trackedTxsConfig?.map((entry) => entry.id) ?? []
        for (const id of trackedTxsIds) {
          assert(
            !ids.has(id),
            `Duplicate TrackedTxsId in ${project.projectId.toString()}`,
          )
          ids.add(id)
        }
      }
    })
    describe('transfers', () => {
      it('every configuration points to unique transfer params', () => {
        const transfers = new Set<string>()
        for (const project of projects) {
          const transferConfigs = project.trackedTxsConfig?.filter(
            (
              e,
            ): e is TrackedTxConfigEntry & {
              params: TrackedTxTransferConfig
            } => e.params.formula === 'transfer',
          )
          for (const config of transferConfigs ?? []) {
            const key = `${config.params.from.toString()}-${config.params.to.toString()}-${
              config.type
            }`
            assert(
              !transfers.has(key),
              `Duplicate transfer config in ${project.projectId.toString()}`,
            )
            transfers.add(key)
          }
        }
      })
    })
    describe('function calls', () => {
      it('every configuration points to unique function call params', () => {
        const functionCalls = new Set<string>()
        for (const project of projects) {
          const functionCallConfigs = project.trackedTxsConfig?.filter(
            (
              e,
            ): e is TrackedTxConfigEntry & {
              params: TrackedTxFunctionCallConfig
            } => e.params.formula === 'functionCall',
          )
          for (const config of functionCallConfigs ?? []) {
            const key = `${config.params.address.toString()}-${
              config.params.selector
            }-${config.untilTimestamp?.toString()}-${config.type}`
            assert(
              !functionCalls.has(key),
              `Duplicate function call config in ${project.projectId.toString()}`,
            )
            functionCalls.add(key)
          }
        }
      })
    })
  })
})

const getMockToken = (token: Partial<Token>): Token => {
  return {
    name: 'Mock',
    id: AssetId('mock-token'),
    coingeckoId: CoingeckoId('mock-token'),
    symbol: 'MOCK',
    decimals: 18,
    address: EthereumAddress.ZERO,
    sinceTimestamp: new UnixTime(0),
    category: 'other',
    chainId: ChainId.ETHEREUM,
    source: 'canonical',
    supply: 'zero',
    ...token,
  }
}
function getMockEscrow(
  escrow: Partial<ScalingProjectEscrow>,
): ScalingProjectEscrow {
  return mockObject<ScalingProjectEscrow>({
    address: EthereumAddress.random(),
    tokens: '*',
    excludedTokens: [],
    chain: 'chain',
    sinceTimestamp: UnixTime.ZERO,
    ...escrow,
  })
}
