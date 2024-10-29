import { expect } from 'earl'
import { factorialize } from './factorialize'

describe(factorialize.name, () => {
  it('should return 1 for 0', () => {
    expect(factorialize(0)).toEqual(1)
  })

  it('should return -1 for negative numbers', () => {
    expect(factorialize(-5)).toEqual(-1)
  })

  it('should calculate factorial for positive numbers', () => {
    expect(factorialize(5)).toEqual(120)
    expect(factorialize(3)).toEqual(6)
    expect(factorialize(10)).toEqual(3628800)
  })

  it('should handle large numbers without overflow', () => {
    expect(factorialize(20)).toEqual(2432902008176640000)
  })
})
