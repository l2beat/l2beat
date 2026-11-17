import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import {
  LIVE_BLOCKS_KEPT_FOR,
  LiveActivityCleaner,
} from './LiveActivityCleaner'

describe(LiveActivityCleaner.name, () => {
  it('deletes the blocks older than they are kept for', async () => {
    const repository = mockObject<Database['liveActivityBlock']>({
      deleteBefore: mockFn().resolvesTo(3),
    })
    const cleaner = new LiveActivityCleaner(
      mockDatabase({ liveActivityBlock: repository }),
      Logger.SILENT,
    )
    const before = UnixTime.now()

    await cleaner.run()

    const [cutoff] = repository.deleteBefore.calls[0]?.args ?? []
    expect(cutoff).toBeGreaterThanOrEqual(before - LIVE_BLOCKS_KEPT_FOR)
    expect(cutoff).toBeLessThanOrEqual(UnixTime.now() - LIVE_BLOCKS_KEPT_FOR)
  })
})
