import { expect } from 'earl'
import { formatTokenAmount } from './formatTokenAmount'

describe(formatTokenAmount.name, () => {
  it('stops a dollar stablecoin at cents without padding zeros', () => {
    expect(formatTokenAmount(25.13428, 25.11)).toEqual('25.13')
    expect(formatTokenAmount(31_271.963, 31_250)).toEqual('31,271.96')
    expect(formatTokenAmount(400, 399.76)).toEqual('400')
    expect(formatTokenAmount(0.998068, 1)).toEqual('1')
  })

  it('shows pricier tokens down to about a cent', () => {
    expect(formatTokenAmount(0.5123456, 1_537)).toEqual('0.51235')
  })

  it('falls back to magnitude when the value is unknown', () => {
    expect(formatTokenAmount(0.01234567, undefined)).toEqual('0.012346')
    expect(formatTokenAmount(12.3456, undefined)).toEqual('12.35')
  })
})
