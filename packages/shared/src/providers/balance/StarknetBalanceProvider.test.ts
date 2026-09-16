import { Logger } from '@l2beat/backend-tools'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { StarknetClient } from '../../clients'
import {
  STARKNET_BALANCE_OF_SELECTOR,
  StarknetBalanceProvider,
} from './StarknetBalanceProvider'

describe(StarknetBalanceProvider.name, () => {
  const BLOCK = 100
  const CHAIN = 'starknet'
  const BALANCES = [
    { token: '0x123', holder: '0xabc' },
    { token: '0x456', holder: '0xdef' },
    { token: '0x789', holder: '0x012' },
  ]

  describe(StarknetBalanceProvider.prototype.getBalances.name, () => {
    it('performs a balanceOf call for each token and decodes u256 values', async () => {
      const client = mockObject<StarknetClient>({
        call: vi
          .fn()
          .mockResolvedValueOnce(['0x1'])
          .mockResolvedValueOnce(['0x2', '0x1'])
          .mockResolvedValueOnce([]),
        chain: CHAIN,
      })
      const balanceProvider = new StarknetBalanceProvider(
        [client, mockObject<StarknetClient>({ chain: 'random' })],
        Logger.SILENT,
      )

      const result = await balanceProvider.getBalances(BALANCES, BLOCK, CHAIN)

      expect(client.call).toHaveBeenNthCalledWith(
        1,
        {
          contract_address: BALANCES[0].token,
          entry_point_selector: STARKNET_BALANCE_OF_SELECTOR,
          calldata: [BALANCES[0].holder],
        },
        BLOCK,
      )
      expect(client.call).toHaveBeenNthCalledWith(
        2,
        {
          contract_address: BALANCES[1].token,
          entry_point_selector: STARKNET_BALANCE_OF_SELECTOR,
          calldata: [BALANCES[1].holder],
        },
        BLOCK,
      )
      expect(client.call).toHaveBeenNthCalledWith(
        3,
        {
          contract_address: BALANCES[2].token,
          entry_point_selector: STARKNET_BALANCE_OF_SELECTOR,
          calldata: [BALANCES[2].holder],
        },
        BLOCK,
      )
      expect(result).toStrictEqual([1n, 2n + (1n << 128n), 0n])
    })

    it('throws if any call fails', async () => {
      const client = mockObject<StarknetClient>({
        call: vi
          .fn()
          .mockResolvedValueOnce(['0x1'])
          .mockResolvedValueOnce(['0x2'])
          .mockRejectedValueOnce(new Error('RPC failure')),
        chain: CHAIN,
      })
      const balanceProvider = new StarknetBalanceProvider(
        [client],
        Logger.SILENT,
      )

      await expect(
        balanceProvider.getBalances(BALANCES, BLOCK, CHAIN),
      ).rejects.toThrow('RPC failure')
    })

    it('throws if there is no client for the chain', () => {
      const balanceProvider = new StarknetBalanceProvider(
        [mockObject<StarknetClient>({ chain: 'other-chain' })],
        Logger.SILENT,
      )

      expect(() => balanceProvider.getBalances(BALANCES, BLOCK, CHAIN)).toThrow(
        `Missing starknet client for ${CHAIN}`,
      )
    })
  })
})
