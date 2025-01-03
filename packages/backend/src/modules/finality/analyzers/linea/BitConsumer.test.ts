import { expect } from 'earl'
import { BitConsumer } from './BitConsumer'

/**
 *   - Returns how many bits are skipped to move to the next byte boundary.
 *   - If already on a byte boundary, returns 0.
 */
function align(r: BitConsumer): number {
  const remainder = r.bitPos % 8
  if (remainder === 0) {
    return 0
  }
  const skipped = 8 - remainder
  r.moveCursor(skipped)
  return skipped
}

describe(BitConsumer.name, () => {
  let data: Uint8Array
  let r: BitConsumer

  beforeEach(() => {
    data = new Uint8Array([
      0x03, 0xff, 0xcc, 0x1a, 0xbc, 0xde, 0x80, 0x01, 0x02, 0xf8, 0x08, 0xf0,
    ])
    r = new BitConsumer(data)
  })

  it('reads bits', () => {
    expect(r.consume(8)).toEqual(3)
    expect(r.consume(8)).toEqual(255)
    expect(r.consume(4)).toEqual(0x0c)
    expect(r.consume(8)).toEqual(0xc1)
    expect(r.consume(20)).toEqual(0xabcde)
    expect(r.consume(1)).toEqual(1)
    expect(r.consume(1)).toEqual(0)

    // Align() -> expect 6 bits to skip
    expect(align(r)).toEqual(6)

    const b1 = r.consume(8)
    const b2 = r.consume(8)
    expect([b1, b2]).toEqual([0x01, 0x02])

    expect(r.consume(4)).toEqual(0x0f)

    const b3 = r.consume(8)
    const b4 = r.consume(8)
    expect([b3, b4]).toEqual([0x80, 0x8f])
  })
})
