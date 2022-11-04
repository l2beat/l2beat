import { expect } from 'earljs'

import { getMembers } from '../../../src/common/utils/getMembers'

describe(getMembers.name, () => {
  it('member revoked', () => {
    const granted = ['ONE', 'TWO', 'THREE']

    const revoked = ['TWO']

    const members = getMembers(granted, revoked)

    expect(members).toEqual(['ONE', 'THREE'])
  })

  it('member revoked and added again', () => {
    const granted = ['ONE', 'TWO', 'THREE', 'TWO']

    const revoked = ['TWO']

    const members = getMembers(granted, revoked)

    expect(members).toEqual(['ONE', 'THREE', 'TWO'])
  })
})
