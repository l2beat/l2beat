import { expect } from 'earl'
import { getCompareEntryUrl } from './getCompareEntryUrl'

describe(getCompareEntryUrl.name, () => {
  it('returns the bare path for the default TVS entry', () => {
    expect(getCompareEntryUrl()).toEqual('/scaling/compare')
    expect(getCompareEntryUrl({ metric: 'tvs' })).toEqual('/scaling/compare')
  })

  it('encodes a non-default metric', () => {
    expect(getCompareEntryUrl({ metric: 'activity' })).toEqual(
      '/scaling/compare?charts=activity',
    )
  })

  it('pre-selects a project', () => {
    expect(getCompareEntryUrl({ projectSlug: 'arbitrum' })).toEqual(
      '/scaling/compare?projects=arbitrum',
    )
    expect(
      getCompareEntryUrl({ metric: 'activity', projectSlug: 'arbitrum' }),
    ).toEqual('/scaling/compare?projects=arbitrum&charts=activity')
  })
})
