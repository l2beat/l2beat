import { expect } from 'earl'
import { getInteropTransferValue } from './getInteropTransferValue.js'

describe(getInteropTransferValue.name, () => {
  it('returns max when both values are defined', () => {
    const result = getInteropTransferValue({
      srcValueUsd: 100,
      dstValueUsd: 150,
    })

    expect(result).toEqual(150)

    const result2 = getInteropTransferValue({
      srcValueUsd: 150,
      dstValueUsd: 100,
    })

    expect(result2).toEqual(150)
  })

  it('returns dst value when src is undefined', () => {
    const result = getInteropTransferValue({
      srcValueUsd: undefined,
      dstValueUsd: 150,
    })

    expect(result).toEqual(150)
  })

  it('returns src value when dst is undefined', () => {
    const result = getInteropTransferValue({
      srcValueUsd: 100,
      dstValueUsd: undefined,
    })

    expect(result).toEqual(100)
  })

  it('returns undefined when both values are undefined', () => {
    const result = getInteropTransferValue({
      srcValueUsd: undefined,
      dstValueUsd: undefined,
    })

    expect(result).toEqual(undefined)
  })
})
