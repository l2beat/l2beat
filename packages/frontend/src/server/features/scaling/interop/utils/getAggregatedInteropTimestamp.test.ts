import { expect } from 'earl'
import { env } from '~/env'
import { getAggregatedInteropTimestamp } from './getAggregatedInteropTimestamp'

describe(getAggregatedInteropTimestamp.name, () => {
  let INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE: number | undefined

  beforeEach(() => {
    INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE =
      env.INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE
  })

  afterEach(() => {
    env.INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE =
      INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE
  })

  it('uses timestamp override when configured', async () => {
    env.INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE = 1_717_856_000

    const result = await getAggregatedInteropTimestamp()

    expect(result).toEqual(1_717_856_000)
  })
})
