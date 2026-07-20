import { expect } from 'earl'
import { getProjectUpdatesQuery } from './getProjectUpdatesQuery'

describe(getProjectUpdatesQuery.name, () => {
  it('parses the selected update and converts the page to a zero-based index', () => {
    expect(
      getProjectUpdatesQuery({
        update: 'update-1700000000',
        updatesPage: '3',
      }),
    ).toEqual({
      selectedUpdateId: 'update-1700000000',
      updatesPage: 2,
    })
  })

  it('ignores invalid pages', () => {
    expect(getProjectUpdatesQuery({ updatesPage: '3abc' })).toEqual({
      selectedUpdateId: undefined,
      updatesPage: undefined,
    })
    expect(getProjectUpdatesQuery({ updatesPage: '0' })).toEqual({
      selectedUpdateId: undefined,
      updatesPage: undefined,
    })
  })
})
