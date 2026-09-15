import { Logger } from '@l2beat/backend-tools'
import type {
  BalanceProvider,
  BlockTimestampProvider,
  CirculatingSupplyProvider,
  PriceProvider,
  StarknetBalanceProvider,
  StarknetTotalSupplyProvider,
  TotalSupplyProvider,
} from '@l2beat/shared'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { OnchainAmountConfig } from '../types'
import { DataFormulaExecutor } from './DataFormulaExecutor'
import type { LocalStorage } from './LocalStorage'

describe(DataFormulaExecutor.name, () => {
  describe(DataFormulaExecutor.prototype.execute.name, () => {
    it('sums balanceOfEscrows holders into one amount per config', async () => {
      const timestamp = UnixTime(1000)
      const blockNumber = 12345
      const chain = 'arbitrum'
      const token = EthereumAddress.random()
      const escrow = EthereumAddress.random()
      const holdersA = [EthereumAddress.random(), EthereumAddress.random()]
      const holdersB = [
        EthereumAddress.random(),
        EthereumAddress.random(),
        EthereumAddress.random(),
      ]

      const single: OnchainAmountConfig = {
        id: 'single',
        type: 'balanceOfEscrow',
        address: token,
        chain,
        escrowAddress: escrow,
        decimals: 18,
        sinceTimestamp: 0,
      }
      const aggregateA: OnchainAmountConfig = {
        id: 'aggregate-a',
        type: 'balanceOfEscrows',
        address: token,
        chain,
        escrowAddresses: holdersA,
        decimals: 18,
        sinceTimestamp: 0,
      }
      const aggregateB: OnchainAmountConfig = {
        id: 'aggregate-b',
        type: 'balanceOfEscrows',
        address: token,
        chain,
        escrowAddresses: holdersB,
        decimals: 18,
        sinceTimestamp: 0,
      }

      const balances = new Map<string, bigint>([
        [escrow, 1n],
        [holdersA[0], 10n],
        [holdersA[1], 20n],
        [holdersB[0], 100n],
        [holdersB[1], 200n],
        [holdersB[2], 300n],
      ])

      const localStorage = mockObject<LocalStorage>({
        getBlockNumber: mockFn().resolvesTo(blockNumber),
        getAmount: mockFn().resolvesTo(undefined),
        writeAmounts: mockFn().resolvesTo(undefined),
      })
      const balanceProvider = mockObject<BalanceProvider>({
        getBalances: mockFn<BalanceProvider['getBalances']>().executes(
          (queries) =>
            Promise.resolve(queries.map((q) => balances.get(q.holder) ?? 0n)),
        ),
      })

      const executor = new DataFormulaExecutor(
        localStorage,
        undefined,
        mockObject<PriceProvider>({}),
        mockObject<CirculatingSupplyProvider>({}),
        new Map(),
        mockObject<BlockTimestampProvider>({}),
        mockObject<TotalSupplyProvider>({}),
        mockObject<StarknetTotalSupplyProvider>({}),
        mockObject<StarknetBalanceProvider>({}),
        balanceProvider,
        Logger.SILENT,
      )

      await executor.execute(
        [],
        [single, aggregateA, aggregateB],
        timestamp,
        false,
      )

      // one batched read per formula type, aggregate holders flattened in order
      expect(balanceProvider.getBalances).toHaveBeenCalledTimes(2)
      expect(balanceProvider.getBalances).toHaveBeenNthCalledWith(
        1,
        [{ token, holder: escrow }],
        blockNumber,
        chain,
      )
      expect(balanceProvider.getBalances).toHaveBeenNthCalledWith(
        2,
        [...holdersA, ...holdersB].map((holder) => ({ token, holder })),
        blockNumber,
        chain,
      )

      // per-holder results folded back into one amount per config
      expect(localStorage.writeAmounts).toHaveBeenCalledTimes(2)
      expect(localStorage.writeAmounts).toHaveBeenNthCalledWith(1, timestamp, [
        { id: 'single', amount: 1n },
      ])
      expect(localStorage.writeAmounts).toHaveBeenNthCalledWith(2, timestamp, [
        { id: 'aggregate-a', amount: 30n },
        { id: 'aggregate-b', amount: 600n },
      ])
    })
  })
})
