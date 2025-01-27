import { createAmountId } from '@l2beat/backend-shared'
import { Logger } from '@l2beat/backend-tools'
import type { AmountRecord, Database } from '@l2beat/database'
import {
  CoingeckoId,
  EthereumAddress,
  type PremintedEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { AmountService } from '../services/AmountService'
import type { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import type { SyncOptimizer } from '../utils/SyncOptimizer'
import { PremintedIndexer } from './PremintedIndexer'
import type { PremintedIndexerDeps } from './types'

const TOKEN = mockObject<PremintedEntry>({
  chain: 'chain',
  project: ProjectId('project'),
  type: 'preminted',
  address: EthereumAddress.ZERO,
  coingeckoId: CoingeckoId('id'),
  escrowAddress: EthereumAddress.ZERO,
})
const CONFIG_ID = createAmountId(TOKEN)

describe(PremintedIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(PremintedIndexer.prototype.update.name, () => {
    it('Circulating supply smaller than locked in escrow', async () => {
      const timestamp = new UnixTime(100)
      const circulatingAmount = 100n
      const escrowAmount = 100_000n

      const { premintedIndexer, amountRepository, runCommonTests } = setup(
        timestamp,
        TOKEN,
        circulatingAmount,
        escrowAmount,
      )

      const safeHeight = await premintedIndexer.update(50, 100)

      runCommonTests(safeHeight)
      expect(amountRepository.insertMany).toHaveBeenOnlyCalledWith([
        mockObject<AmountRecord>({
          timestamp,
          amount: circulatingAmount,
          configId: CONFIG_ID,
        }),
      ])
    })

    it('Locked in escrow smaller than circulating supply', async () => {
      const timestamp = new UnixTime(100)
      const circulatingAmount = 100_000n
      const escrowAmount = 100n

      const { premintedIndexer, amountRepository, runCommonTests } = setup(
        timestamp,
        TOKEN,
        circulatingAmount,
        escrowAmount,
      )

      const safeHeight = await premintedIndexer.update(50, 100)

      runCommonTests(safeHeight)
      expect(amountRepository.insertMany).toHaveBeenOnlyCalledWith([
        mockObject<AmountRecord & { type: 'escrow' | 'totalSupply' }>({
          timestamp,
          amount: escrowAmount,
          configId: CONFIG_ID,
          type: 'escrow',
        }),
      ])
    })

    it('Circulating supply = Locked in escrow', async () => {
      const timestamp = new UnixTime(100)
      const equalAmount = 100n

      const { premintedIndexer, amountRepository, runCommonTests } = setup(
        timestamp,
        TOKEN,
        equalAmount,
        equalAmount,
      )

      const safeHeight = await premintedIndexer.update(50, 100)

      runCommonTests(safeHeight)
      expect(amountRepository.insertMany).toHaveBeenOnlyCalledWith([
        mockObject<AmountRecord>({
          timestamp,
          amount: equalAmount,
          configId: CONFIG_ID,
        }),
      ])
    })

    it('Skips update due to sync optimization', async () => {
      const from = 50
      const to = 100
      const optimizedTimestamp = to + 1

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: () => new UnixTime(optimizedTimestamp),
      })

      const premintedIndexer = mockIndexer({
        syncOptimizer,
      })

      const safeHeight = await premintedIndexer.update(from, to)

      expect(safeHeight).toEqual(to)
    })

    it('Skips update due to minHeight', async () => {
      const from = 50
      const to = 100

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: () => new UnixTime(to),
      })

      const premintedIndexer = mockIndexer({
        minHeight: to + 1,
        syncOptimizer,
      })

      const safeHeight = await premintedIndexer.update(from, to)

      expect(safeHeight).toEqual(to)
    })
  })

  describe(PremintedIndexer.prototype.invalidate.name, () => {
    it('deletes records and returns target height', async () => {
      const amountRepository = mockObject<Database['amount']>({
        deleteByConfigAfter: async () => 1,
      })

      const premintedIndexer = mockIndexer({
        db: mockObject<Database>({
          amount: amountRepository,
        }),
      })

      const targetHeight = 100

      await premintedIndexer.invalidate(targetHeight)

      expect(amountRepository.deleteByConfigAfter).toHaveBeenOnlyCalledWith(
        CONFIG_ID,
        new UnixTime(targetHeight),
      )
    })
  })
})

function setup(
  timestamp: UnixTime,
  token: PremintedEntry,
  circulatingAmount: bigint,
  escrowAmount: bigint,
) {
  const blockNumber = 100

  const amountRepository = mockObject<Database['amount']>({
    insertMany: async () => 1,
  })

  const blockTimestampRepository = mockObject<Database['blockTimestamp']>({
    findBlockNumberByChainAndTimestamp: async () => blockNumber,
  })

  const db = mockObject<Database>({
    amount: amountRepository,
    blockTimestamp: blockTimestampRepository,
  })

  const syncOptimizer = mockObject<SyncOptimizer>({
    getTimestampToSync: () => timestamp,
  })

  const circulatingSupplyService = mockObject<CirculatingSupplyService>({
    fetchCirculatingSupplies: async () => [
      {
        timestamp,
        amount: circulatingAmount,
        configId: createAmountId(token),
      },
    ],
  })

  const amountService = mockObject<AmountService>({
    fetchAmounts: async () => [
      {
        timestamp,
        amount: escrowAmount,
        configId: createAmountId(token),
        type: 'escrow',
      },
    ],
  })

  const runCommonTests = (safeHeight: number) => {
    expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(50)

    expect(
      blockTimestampRepository.findBlockNumberByChainAndTimestamp,
    ).toHaveBeenOnlyCalledWith('chain', new UnixTime(100))

    expect(amountService.fetchAmounts).toHaveBeenOnlyCalledWith(
      new UnixTime(100),
      100,
      [toEscrowEntry(token)],
    )

    expect(
      circulatingSupplyService.fetchCirculatingSupplies,
    ).toHaveBeenCalledWith(
      new UnixTime(100),
      new UnixTime(100),
      toCirculatingEntry(token),
    )

    expect(safeHeight).toEqual(100)
  }

  const premintedIndexer = mockIndexer({
    db,
    syncOptimizer,
    circulatingSupplyService,
    amountService,
  })

  return {
    premintedIndexer,
    amountRepository,
    runCommonTests,
  }
}

function mockIndexer(props: Partial<PremintedIndexerDeps>): PremintedIndexer {
  return new PremintedIndexer({
    circulatingSupplyService: mockObject<CirculatingSupplyService>({}),
    amountService: mockObject<AmountService>({}),
    db: mockObject<Database>({}),
    syncOptimizer: mockObject<SyncOptimizer>({}),
    configuration: TOKEN,
    parents: [],
    minHeight: 0,
    indexerService: mockObject<IndexerService>({}),
    logger: Logger.SILENT,
    ...props,
  })
}

function toEscrowEntry(token: PremintedEntry) {
  return {
    ...token,
    type: 'escrow' as const,
    address: token.address,
    id: createAmountId(token),
  }
}

function toCirculatingEntry(token: PremintedEntry) {
  return {
    ...token,
    type: 'circulatingSupply' as const,
    coingeckoId: token.coingeckoId,
    id: createAmountId(token),
  }
}
