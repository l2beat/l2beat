import { Logger } from '@l2beat/backend-tools'
import { describe, expect, it, vi } from 'vitest'
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
      const client = {
        call: vi
          .fn()
          .mockResolvedValueOnce(['0x1'])
          .mockResolvedValueOnce(['0x2'])
          .mockResolvedValueOnce(['0x0']),
        chain: CHAIN,
      } as unknown as StarknetClient

      const totalSupplyProvider = new StarknetTotalSupplyProvider(
        [client, { chain: 'random' } as unknown as StarknetClient],
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

    it('throws if any call fails', async () => {
      const client = {
        call: vi
          .fn()
          .mockResolvedValueOnce(['0x1'])
          .mockResolvedValueOnce(['0x2'])
          .mockRejectedValueOnce(new Error('RPC failure')),
        chain: CHAIN,
      } as unknown as StarknetClient

      const totalSupplyProvider = new StarknetTotalSupplyProvider(
        [client],
        Logger.SILENT,
      )

      await expect(
        totalSupplyProvider.getTotalSupplies(TOKENS, BLOCK, CHAIN),
      ).rejects.toThrow('RPC failure')
    })

    it('throws error if no client for chain', async () => {
      const totalSupplyProvider = new StarknetTotalSupplyProvider(
        [{ chain: 'other-chain' } as unknown as StarknetClient],
        Logger.SILENT,
      )

      expect(() =>
        totalSupplyProvider.getTotalSupplies(TOKENS, BLOCK, CHAIN),
      ).toThrow(`Missing starknet client for ${CHAIN}`)
    })
  })
})
