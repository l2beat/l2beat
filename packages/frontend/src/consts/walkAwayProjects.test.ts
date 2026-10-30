import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getWalkAwayVerdict } from './walkAwayProjects'

const archivedAt = UnixTime(1700000000)

describe(getWalkAwayVerdict.name, () => {
  it('passes a listed project even when it is archived', () => {
    expect(getWalkAwayVerdict({ id: 'arbitrum', archivedAt })).toEqual('passed')
  })

  it('fails a listed project that is still active', () => {
    expect(getWalkAwayVerdict({ id: 'starknet' })).toEqual('not-passed')
  })

  it('fails an archived project that is not listed', () => {
    expect(getWalkAwayVerdict({ id: 'made-up', archivedAt })).toEqual(
      'not-passed',
    )
  })

  it('gives no verdict to an active project that is not listed', () => {
    expect(getWalkAwayVerdict({ id: 'made-up' })).toEqual(undefined)
  })
})
