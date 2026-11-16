import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  type CalldataTx,
  calculateCalldataGasUsed,
} from './calculateCalldataGasUsed'

describe(calculateCalldataGasUsed.name, () => {
  const blockTimestamp = UnixTime(1746500000)

  function tx(
    fields: Omit<CalldataTx, 'is_self_transfer' | 'has_value'>,
  ): CalldataTx {
    return { ...fields, is_self_transfer: false, has_value: false }
  }

  it('returns standard calldata cost for blocks before Pectra (< 22431084)', () => {
    const blockNumber = 22431083
    const dataLength = 100
    const nonZeroBytes = 60
    const zeroBytes = dataLength - nonZeroBytes
    const gasUsed = 100000

    const result = calculateCalldataGasUsed(
      tx({
        block_number: blockNumber,
        block_time: blockTimestamp,
        data_length: dataLength,
        non_zero_bytes: nonZeroBytes,
        gas_used: gasUsed,
      }),
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
        tx({
          block_number: blockNumber,
          block_time: blockTimestamp,
          data_length: dataLength,
          non_zero_bytes: nonZeroBytes,
          gas_used: gasUsed,
        }),
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
        tx({
          block_number: blockNumber,
          block_time: blockTimestamp,
          data_length: dataLength,
          non_zero_bytes: nonZeroBytes,
          gas_used: gasUsed,
        }),
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
      tx({
        block_number: blockNumber,
        block_time: blockTimestamp,
        data_length: dataLength,
        non_zero_bytes: nonZeroBytes,
        gas_used: gasUsed,
      }),
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
      tx({
        block_number: blockNumber,
        block_time: blockTimestamp,
        data_length: dataLength,
        non_zero_bytes: nonZeroBytes,
        gas_used: gasUsed,
      }),
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
      tx({
        block_number: 22431084,
        block_time: UnixTime(4102444800),
        data_length: 119_674,
        non_zero_bytes: 119_491,
        gas_used: 7_674_136,
      }),
    )

    expect(result).toEqual(16 * 119_491 + 4 * 183)
  })
})
