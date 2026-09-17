import { describe, expect, it } from 'vitest'
import { getCompareEntryUrl } from './getCompareEntryUrl'

describe(getCompareEntryUrl.name, () => {
  it('returns the bare path for the default TVS entry', () => {
    expect(getCompareEntryUrl()).toBe('/layer2s/compare')
    expect(getCompareEntryUrl({ metric: 'tvs' })).toBe('/layer2s/compare')
  })

  it('encodes a non-default metric', () => {
    expect(getCompareEntryUrl({ metric: 'activity' })).toBe(
      '/layer2s/compare?charts=activity',
    )
  })

  it('pre-selects a project', () => {
    expect(getCompareEntryUrl({ projectSlug: 'arbitrum' })).toBe(
      '/layer2s/compare?projects=arbitrum',
    )
    expect(
      getCompareEntryUrl({ metric: 'activity', projectSlug: 'arbitrum' }),
    ).toBe('/layer2s/compare?projects=arbitrum&charts=activity')
  })
})
