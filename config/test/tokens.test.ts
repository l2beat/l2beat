import { expect } from 'chai'
import { utils } from 'ethers'
import { tokenList } from '../src/tokens'

describe('tokens', () => {
  const addresses = tokenList
    .map((x) => x.address)
    .filter((x): x is string => x !== undefined)

  describe('every addresses is valid and formatted', () => {
    for (const address of addresses) {
      it(address, () => {
        expect(utils.getAddress(address)).to.equal(address)
      })
    }
  })

  it('every token has a unique address', () => {
    const everyUnique = addresses.every((x, i) => addresses.indexOf(x) === i)
    expect(everyUnique).to.equal(true)
  })

  it('tokens are ordered alphabetically', () => {
    const names = tokenList.map((x) => x.name)
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).to.deep.equal(sorted)
  })
})
