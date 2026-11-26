import { expect } from 'earl'
import { BLOB_UPDATE_FRACTIONS } from './feeRules'

describe('fee rules', () => {
  // Receipts' blobGasPrice on both sides of each fork
  const receipts = [
    { block: 22431083, excessBlobGas: 50593792n, blobGasPrice: 3816148n },
    { block: 22431084, excessBlobGas: 50462720n, blobGasPrice: 23789n },
    { block: 23975777, excessBlobGas: 82747184n, blobGasPrice: 15005645n },
    { block: 23975778, excessBlobGas: 83053018n, blobGasPrice: 20973n },
    { block: 24179381, excessBlobGas: 121809838n, blobGasPrice: 2179614n },
    { block: 24179383, excessBlobGas: 121416622n, blobGasPrice: 32568n },
  ]

  for (const { block, excessBlobGas, blobGasPrice } of receipts) {
    it(`prices blob gas as the receipt at block ${block}`, () => {
      const rule = BLOB_UPDATE_FRACTIONS.find((f) => block >= f.fromBlock)

      expect(
        fakeExponential(excessBlobGas, BigInt(rule?.fraction ?? 0)),
      ).toEqual(blobGasPrice)
    })
  }
})

// EIP-4844's fake_exponential(1, excess, fraction)
function fakeExponential(excess: bigint, fraction: bigint): bigint {
  let output = 0n
  let term = fraction
  for (let i = 1n; term > 0n; i++) {
    output += term
    term = (term * excess) / (fraction * i)
  }
  return output / fraction
}
