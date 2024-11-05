import { expect } from 'earl'
import { tai64ToUnix } from './tai64ToUnix'

describe(tai64ToUnix.name, () => {
  it('converts Tai64 to Unix', () => {
    const result = tai64ToUnix('4611686020155261080')
    expect(result).toEqual(1727873166)
  })
})
