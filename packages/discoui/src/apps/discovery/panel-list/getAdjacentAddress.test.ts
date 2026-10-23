import { expect } from 'earl'
import { getAdjacentAddress } from './getAdjacentAddress'

describe(getAdjacentAddress.name, () => {
  const addresses = ['eth:0xA', 'eth:0xB', 'eth:0xC']

  it('moves to the next and previous address', () => {
    expect(getAdjacentAddress(addresses, ['eth:0xB'], 'next')).toEqual(
      'eth:0xC',
    )
    expect(getAdjacentAddress(addresses, ['eth:0xB'], 'previous')).toEqual(
      'eth:0xA',
    )
  })

  it('stops at both ends of the list', () => {
    expect(getAdjacentAddress(addresses, ['eth:0xC'], 'next')).toEqual(
      undefined,
    )
    expect(getAdjacentAddress(addresses, ['eth:0xA'], 'previous')).toEqual(
      undefined,
    )
  })

  it('enters the list from the matching end when nothing listed is selected', () => {
    expect(getAdjacentAddress(addresses, [], 'next')).toEqual('eth:0xA')
    expect(getAdjacentAddress(addresses, ['eth:0xZ'], 'previous')).toEqual(
      'eth:0xC',
    )
  })

  it('anchors on the most recently selected listed address', () => {
    expect(
      getAdjacentAddress(addresses, ['eth:0xC', 'eth:0xA', 'eth:0xZ'], 'next'),
    ).toEqual('eth:0xB')
  })

  it('returns nothing for an empty list', () => {
    expect(getAdjacentAddress([], ['eth:0xA'], 'next')).toEqual(undefined)
  })
})
