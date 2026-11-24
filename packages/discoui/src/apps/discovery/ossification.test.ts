import { expect } from 'earl'
import {
  formatCriticalDate,
  getCriticalStatus,
  isOssificationCritical,
} from './ossification'

describe('ossification helpers', () => {
  it('classifies undefined as none', () => {
    expect(getCriticalStatus(undefined)).toEqual('none')
    expect(isOssificationCritical(undefined)).toEqual(false)
  })

  it('classifies true and open-ended windows as critical', () => {
    expect(getCriticalStatus(true)).toEqual('critical')
    expect(isOssificationCritical(true)).toEqual(true)

    expect(getCriticalStatus({ sinceTimestamp: 1_700_000_000 })).toEqual(
      'critical',
    )
    expect(isOssificationCritical({ sinceTimestamp: 1_700_000_000 })).toEqual(
      true,
    )
  })

  it('classifies windows with untilTimestamp as retired', () => {
    expect(getCriticalStatus({ untilTimestamp: 1_700_000_000 })).toEqual(
      'retired',
    )
    expect(isOssificationCritical({ untilTimestamp: 1_700_000_000 })).toEqual(
      false,
    )

    expect(
      getCriticalStatus({
        sinceTimestamp: 1_600_000_000,
        untilTimestamp: 1_700_000_000,
      }),
    ).toEqual('retired')
    expect(
      isOssificationCritical({
        sinceTimestamp: 1_600_000_000,
        untilTimestamp: 1_700_000_000,
      }),
    ).toEqual(false)
  })

  it('formats unix seconds as UTC YYYY-MM-DD', () => {
    expect(formatCriticalDate(1_700_000_000)).toEqual('2023-11-14')
  })
})
