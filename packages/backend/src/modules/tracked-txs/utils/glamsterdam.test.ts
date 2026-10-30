import { expect } from 'earl'
import {
  getGlamsterdamCalldataGasUsed,
  getGlamsterdamOverhead,
} from './glamsterdam'

// Real Sepolia txs, which has run Glamsterdam since 2026-10-06
const TXS = [
  {
    name: 'a floor-bound call',
    hash: '0x536648e5030725b7b8e2017019684dca375dded11e12cf11b882769c2e7f1f05',
    dataLength: 119_674,
    nonZeroBytes: 119_491,
    gasUsed: 7_674_136,
    calldata: 64 * 119_674,
    overhead: 15_000,
  },
  {
    name: 'a floor-bound call with value',
    hash: '0x8e0a9e1215be89c377ac0f2ea849a3319c9a1ae6e1099623588e9e4991186cd4',
    dataLength: 356,
    nonZeroBytes: 43,
    gasUsed: 43_784,
    calldata: 64 * 356,
    overhead: 15_000,
  },
  {
    name: 'a floor-bound self-transfer',
    hash: '0x3684f83b3a3c2074af0f328a4d51e61dca5c54bfc44d76bef24e31b2d948c8b5',
    dataLength: 228,
    nonZeroBytes: 154,
    gasUsed: 26_592,
    calldata: 64 * 228,
    overhead: 12_000,
  },
  {
    name: 'a call that pays for its execution',
    hash: '0x0c410cb57569e4c731e5e059b24d34365acc6e7a5d97966758c7fcdf5db66dd4',
    dataLength: 1_124,
    nonZeroBytes: 457,
    gasUsed: 125_007,
    calldata: 16 * 457 + 4 * 667,
    overhead: 15_000,
  },
]

describe('glamsterdam', () => {
  for (const tx of TXS) {
    it(`splits ${tx.name} into calldata and overhead (${tx.hash})`, () => {
      const calldata = getGlamsterdamCalldataGasUsed(
        tx.dataLength,
        tx.nonZeroBytes,
        tx.gasUsed,
      )

      expect(calldata).toEqual(tx.calldata)
      expect(getGlamsterdamOverhead(tx.gasUsed, calldata)).toEqual(tx.overhead)
    })
  }
})
