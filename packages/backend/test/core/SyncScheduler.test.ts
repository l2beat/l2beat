import { Logger, mock, UnixTime } from '@l2beat/common'
import { expect, mockFn } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { PriceUpdater } from '../../src/core/PriceUpdater'
import { SyncScheduler } from '../../src/core/SyncScheduler'

describe(SyncScheduler.name, () => {
  it('correctly calls services', async () => {
    const priceUpdater = mock<PriceUpdater>({ update: mockFn().returns(null) })
    const syncScheduler = new SyncScheduler(
      priceUpdater,
      UnixTime.now().add(-2, 'hours'),
      Logger.SILENT,
    )

    syncScheduler.start()

    await waitForExpect(() => {
      expect(priceUpdater.update.calls.length).toEqual(1)
    })

    syncScheduler.stop()
  })
})
