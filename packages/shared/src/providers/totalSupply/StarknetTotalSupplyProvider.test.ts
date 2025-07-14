import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import type { StarknetClient } from '../../clients'
import {
  STARKNET_TOTAL_SUPPLY_SELECTOR,
  StarknetTotalSupplyProvider,
} from './StarknetTotalSupplyProvider'

describe(StarknetTotalSupplyProvider.name, () => {
  const BLOCK = 100
  const CHAIN = 'starknet'
  const TOKENS = ['0x123', '0x456', '0x789']

  describe(StarknetTotalSupplyProvider.prototype.getTotalSupplies.name, () => {
    it('performs call for each address', async () => {
      const client = mockObject<StarknetClient>({
        call: mockFn()
          .resolvesToOnce(['0x1'])
          .resolvesToOnce(['0x2'])
          .rejectsWithOnce('error'),
        chain: CHAIN,
      })

      const totalSupplyProvider = new StarknetTotalSupplyProvider(
        [client, mockObject<StarknetClient>({ chain: 'random' })],
        Logger.SILENT,
      )

      const result = await totalSupplyProvider.getTotalSupplies(
        TOKENS,
        BLOCK,
        CHAIN,
      )

      expect(client.call).toHaveBeenNthCalledWith(
        1,
        {
          contract_address: TOKENS[0],
          entry_point_selector: STARKNET_TOTAL_SUPPLY_SELECTOR,
          calldata: [],
        },
        BLOCK,
      )
      expect(client.call).toHaveBeenNthCalledWith(
        2,
        {
          contract_address: TOKENS[1],
          entry_point_selector: STARKNET_TOTAL_SUPPLY_SELECTOR,
          calldata: [],
        },
        BLOCK,
      )
      expect(client.call).toHaveBeenNthCalledWith(
        3,
        {
          contract_address: TOKENS[2],
          entry_point_selector: STARKNET_TOTAL_SUPPLY_SELECTOR,
          calldata: [],
        },
        BLOCK,
      )
      expect(result).toEqual([1n, 2n, 0n])
    })

    it('throws error if no client for chain', async () => {
      const totalSupplyProvider = new StarknetTotalSupplyProvider(
        [mockObject<StarknetClient>({ chain: 'other-chain' })],
        Logger.SILENT,
      )

      expect(() =>
        totalSupplyProvider.getTotalSupplies(TOKENS, BLOCK, CHAIN),
      ).toThrow(`Missing starknet client for ${CHAIN}`)
    })
  })
})
