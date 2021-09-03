import { expect } from 'chai'
import { utils } from 'ethers'

import { asNumber } from '../../../../src/services/balances/utils/asNumber'

describe('asNumber', () => {
  it('correctly formats some ether', () => {
    const value = utils.parseEther('1.23456789')
    const expected = 1.234568
    const result = asNumber(value, 18, 6)
    expect(result).to.equal(expected)
  })
})
