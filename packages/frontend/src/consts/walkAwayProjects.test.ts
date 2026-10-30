import { expect } from 'earl'
import { getWalkAwayVerdict } from './walkAwayProjects'

describe(getWalkAwayVerdict.name, () => {
  it('passes a listed project even when it is archived', () => {
    expect(getWalkAwayVerdict('fuelv1', true)).toEqual('passed')
  })

  it('fails a listed project that is still active', () => {
    expect(getWalkAwayVerdict('starknet', false)).toEqual('not-passed')
  })

  it('fails an archived project that is not on either list', () => {
    expect(getWalkAwayVerdict('redstone', true)).toEqual('not-passed')
  })

  it('gives no verdict to an active project that is not on either list', () => {
    expect(getWalkAwayVerdict('redstone', false)).toEqual(undefined)
  })
})
