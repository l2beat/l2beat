import { expect } from 'earl'
import { getCompareEntryUrl } from './getCompareEntryUrl'

describe(getCompareEntryUrl.name, () => {
  it('returns the bare path for the default TVS entry', () => {
    expect(getCompareEntryUrl()).toEqual('/layer2s/compare')
    expect(getCompareEntryUrl({ metric: 'tvs' })).toEqual('/layer2s/compare')
  })

  it('encodes a non-default metric', () => {
    expect(getCompareEntryUrl({ metric: 'activity' })).toEqual(
      '/layer2s/compare?charts=activity',
    )
  })

  it('pre-selects a project', () => {
    expect(getCompareEntryUrl({ projectSlug: 'arbitrum' })).toEqual(
      '/layer2s/compare?projects=arbitrum',
    )
    expect(
      getCompareEntryUrl({ metric: 'activity', projectSlug: 'arbitrum' }),
    ).toEqual('/layer2s/compare?projects=arbitrum&charts=activity')
  })
})
