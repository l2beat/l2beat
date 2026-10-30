import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { calculateCalldataGasUsed } from './calculateCalldataGasUsed'

describe(calculateCalldataGasUsed.name, () => {
  const blockTimestamp = UnixTime(1746500000)

  it('returns standard calldata cost for blocks before Pectra (< 22431084)', () => {
    const blockNumber = 22431083
    const dataLength = 100
    const nonZeroBytes = 60
    const zeroBytes = dataLength - nonZeroBytes
    const gasUsed = 100000

    const result = calculateCalldataGasUsed(
      blockNumber,
      blockTimestamp,
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
        blockTimestamp,
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
        blockTimestamp,
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
      blockTimestamp,
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
      blockTimestamp,
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

  it('keeps pre-Glamsterdam rules while Glamsterdam is not scheduled', () => {
    // Sepolia 0x536648e5…7f1f05 paid the Glamsterdam calldata floor:
    // 7,674,136 = 15,000 + 64 * 119,674
    const result = calculateCalldataGasUsed(
      22431084,
      UnixTime(4102444800),
      119_674,
      119_491,
      7_674_136,
    )

    expect(result).toEqual(16 * 119_491 + 4 * 183)
  })
})
