import { expect } from 'earl'
import { formatGwei } from './formatGwei'

describe(formatGwei.name, () => {
  it('writes the 1 wei floor in full, not as zero', () => {
    expect(formatGwei(1e-9)).toEqual('0.000000001')
  })

  it('keeps three significant figures without trailing zeros', () => {
    expect(formatGwei(0.008081)).toEqual('0.00808')
    expect(formatGwei(12.04)).toEqual('12')
    expect(formatGwei(120)).toEqual('120')
  })
})
