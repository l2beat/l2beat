import { expect } from 'earl'
import { calculateCalldataGasUsed } from './calculateCalldataGasUsed'

describe(calculateCalldataGasUsed.name, () => {
  it('returns standard calldata cost for blocks before Pectra (< 22431084)', () => {
    const blockNumber = 22431083
    const dataLength = 100
    const nonZeroBytes = 60
    const zeroBytes = dataLength - nonZeroBytes
    const gasUsed = 100000

    const result = calculateCalldataGasUsed(
      blockNumber,
      dataLength,
      nonZeroBytes,
      gasUsed,
    )

    const expectedStandardCalldata = 16 * nonZeroBytes + 4 * zeroBytes
    expect(result).toEqual(expectedStandardCalldata)
  })

  describe('for blocks after Pectra (>= 22431084)', () => {
    const blockNumber = 22431084

    it('returns standard calldata cost when compute is high enough', () => {
      const dataLength = 100
      const nonZeroBytes = 60
      const zeroBytes = dataLength - nonZeroBytes
      const standardCalldata = 16 * nonZeroBytes + 4 * zeroBytes

      // Set gasUsed high enough to ensure compute >= 1.5 * standardCalldata
      const compute = 1.5 * standardCalldata
      const gasUsed = standardCalldata + 21000 + compute

      const result = calculateCalldataGasUsed(
        blockNumber,
        dataLength,
        nonZeroBytes,
        gasUsed,
      )

      expect(result).toEqual(standardCalldata)
    })

    it('returns higher calldata cost when compute is lower than threshold', () => {
      const dataLength = 100
      const nonZeroBytes = 60
      const zeroBytes = dataLength - nonZeroBytes
      const standardCalldata = 16 * nonZeroBytes + 4 * zeroBytes

      // Set gasUsed low enough to ensure compute < 1.5 * standardCalldata
      const compute = 1.5 * standardCalldata - 1
      const gasUsed = standardCalldata + 21000 + compute

      const result = calculateCalldataGasUsed(
        blockNumber,
        dataLength,
        nonZeroBytes,
        gasUsed,
      )

      const expectedHigherCost = 40 * nonZeroBytes + 10 * zeroBytes
      expect(result).toEqual(expectedHigherCost)
    })
  })

  it('handles edge case with zero bytes', () => {
    const blockNumber = 22431084
    const dataLength = 50
    const nonZeroBytes = 0
    const gasUsed = 30000

    const result = calculateCalldataGasUsed(
      blockNumber,
      dataLength,
      nonZeroBytes,
      gasUsed,
    )

    // All bytes are zero bytes in this case
    const standardCalldata = 4 * dataLength
    const compute = gasUsed - standardCalldata - 21000

    expect(result).toEqual(
      compute >= 1.5 * standardCalldata ? standardCalldata : 10 * dataLength,
    )
  })

  it('handles edge case with all non-zero bytes', () => {
    const blockNumber = 22431084
    const dataLength = 50
    const nonZeroBytes = 50
    const gasUsed = 30000

    const result = calculateCalldataGasUsed(
      blockNumber,
      dataLength,
      nonZeroBytes,
      gasUsed,
    )

    // All bytes are non-zero bytes in this case
    const standardCalldata = 16 * dataLength
    const compute = gasUsed - standardCalldata - 21000

    expect(result).toEqual(
      compute >= 1.5 * standardCalldata ? standardCalldata : 40 * dataLength,
    )
  })
})
