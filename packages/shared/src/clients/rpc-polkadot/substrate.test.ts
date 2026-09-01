import { expect } from 'earl'
import {
  bytesToHex,
  decodeCompact,
  decodeU32Le,
  encodeU32Le,
  hexToBytes,
  twox64Concat,
  twox128,
} from './substrate'

// Expected values verified against @polkadot/util-crypto's xxhashAsHex.
describe('substrate', () => {
  describe(twox128.name, () => {
    const cases = [
      ['Staking', '0x5f3e4907f716ac89b6347d15ececedca'],
      ['CurrentEra', '0x0b6a45321efae92aea15e0740ec7afe7'],
      ['ErasStakersOverview', '0x7493ea190d0af47acc70e25428f8b1a3'],
      ['', '0x99e9d85137db46ef4bbea33613baafd5'],
    ] as const

    for (const [input, expected] of cases) {
      it(`hashes ${JSON.stringify(input)}`, () => {
        expect(bytesToHex(twox128(new TextEncoder().encode(input)))).toEqual(
          expected,
        )
      })
    }
  })

  describe(twox64Concat.name, () => {
    it('hashes an encoded era and appends the input', () => {
      const era = encodeU32Le(790)
      const result = bytesToHex(twox64Concat(era))
      expect(result).toEqual('0x2f9e04a205412d2e16030000')
      expect(result.endsWith('16030000')).toEqual(true) // 790 as u32 LE
    })
  })

  describe(decodeCompact.name, () => {
    const cases = [
      ['0x00', 0n, 1],
      ['0x04', 1n, 1],
      ['0xa8', 42n, 1],
      ['0x1501', 69n, 2],
      ['0x02000100', 16384n, 4],
      ['0x0370605040', 0x40506070n, 5],
      ['0x0b00407a10f35a', 100_000_000_000_000n, 7],
    ] as const

    for (const [hex, value, offset] of cases) {
      it(`decodes ${hex}`, () => {
        expect(decodeCompact(hexToBytes(hex), 0)).toEqual({ value, offset })
      })
    }

    it('decodes a SCALE PagedExposureMetadata value', () => {
      // compact total, compact own, u32 nominatorCount, u32 pageCount
      const bytes = hexToBytes('0x02000100a80500000001000000')
      const total = decodeCompact(bytes, 0)
      const own = decodeCompact(bytes, total.offset)
      expect(total.value).toEqual(16384n)
      expect(own.value).toEqual(42n)
      expect(decodeU32Le(bytes, own.offset)).toEqual(5)
    })
  })
})
