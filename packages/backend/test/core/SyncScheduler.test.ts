import { Logger, mock, UnixTime } from '@l2beat/common'
import { expect, mockFn } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { BalanceUpdater } from '../../src/core/BalanceUpdater'
import { BlockNumberUpdater } from '../../src/core/BlockNumberUpdater'
import { PriceUpdater } from '../../src/core/PriceUpdater'
import { ReportUpdater } from '../../src/core/ReportUpdater'
import { SyncScheduler } from '../../src/core/SyncScheduler'

describe(SyncScheduler.name, () => {
  it('correctly calls services', async () => {
    const blockNumberUpdater = mock<BlockNumberUpdater>({
      update: mockFn().returns([1000n]),
    })
    const priceUpdater = mock<PriceUpdater>({ update: mockFn().returns(null) })
    const balanceUpdater = mock<BalanceUpdater>({
      update: mockFn().returns(null),
    })
    const reportUpdater = mock<ReportUpdater>({
      update: mockFn().returns(null),
    })
    const syncScheduler = new SyncScheduler(
      blockNumberUpdater,
      priceUpdater,
      balanceUpdater,
      reportUpdater,
      UnixTime.now().add(-2, 'hours'),
      Logger.SILENT,
    )

    syncScheduler.start()

    await waitForExpect(() => {
      expect(blockNumberUpdater.update.calls.length).toEqual(1)
      expect(priceUpdater.update.calls.length).toEqual(1)
      expect(balanceUpdater.update.calls.length).toEqual(1)
      expect(reportUpdater.update.calls.length).toEqual(1)
    })

    syncScheduler.stop()
  })
})
