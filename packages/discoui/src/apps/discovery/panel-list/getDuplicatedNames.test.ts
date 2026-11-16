import { expect } from 'earl'
import { getDuplicatedNames } from './getDuplicatedNames'

describe(getDuplicatedNames.name, () => {
  it('returns the names shared by more than one entry', () => {
    const duplicated = getDuplicatedNames([
      { name: 'GnosisSafe' },
      { name: 'Bridge' },
      { name: 'GnosisSafe' },
      { name: 'GnosisSafe' },
    ])
    expect([...duplicated]).toEqual(['GnosisSafe'])
  })

  it('ignores entries without a name', () => {
    const duplicated = getDuplicatedNames([{}, {}, { name: 'Bridge' }])
    expect([...duplicated]).toEqual([])
  })
})
