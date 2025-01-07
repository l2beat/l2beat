import { readFileSync } from 'fs'
import path from 'path'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { byteArrFromHexStr } from '../../utils/byteArrFromHexStr'
import { BufferReader, decodeBatch } from './decodeBatch'

describe(decodeBatch.name, () => {
  it('should decode the span batch blob', () => {
    const buff = readFileSync(path.join(__dirname, 'stub/batch_base.json'))
    const stub = JSON.parse(buff.toString()) as {
      batch: string
      decoded: { timestamp: number; blockNumber: number; txCount: number }[]
    }

    const batch = byteArrFromHexStr(stub.batch)
    const data = decodeBatch(batch, {
      l2BlockTimeSeconds: 2,
      genesisTimestamp: new UnixTime(1686789347),
      blockOffset: 0,
    })
    expect(data).toEqual(stub.decoded)
  })

  it('should decode the batch v0 blob', () => {
    const buff = readFileSync(path.join(__dirname, 'stub/batch_version0.json'))
    const stub = JSON.parse(buff.toString()) as {
      batch: string
      decoded: { timestamp: number; blockNumber: number; txCount: number }[]
    }

    const batch = byteArrFromHexStr(stub.batch)
    const data = decodeBatch(batch, {
      l2BlockTimeSeconds: 2,
      genesisTimestamp: new UnixTime(1708809815),
      blockOffset: 0,
    })
    expect(data).toEqual(stub.decoded)
  })
})

describe(BufferReader.name, () => {
  describe('should read the varint', () => {
    const cases: { varint: Uint8Array; expected: number }[] = [
      {
        varint: new Uint8Array([0b10101110, 0b00000010]),
        expected: 0b00000100101110,
      },
      {
        varint: new Uint8Array([1]),
        expected: 1,
      },
      {
        varint: new Uint8Array([0b10000000, 0b00000001]),
        expected: 128,
      },
      {
        varint: new Uint8Array([0b10000000, 0b10000000, 0b00000001]),
        expected: 16384,
      },
    ]

    for (const { varint, expected } of cases) {
      it(`should read ${expected}`, () => {
        const reader = new BufferReader(varint)
        const actual = reader.uint32()
        expect(actual).toEqual(expected)
        expect(reader.pos).toEqual(varint.length)
      })
    }
  })

  it(BufferReader.prototype.skip.name, () => {
    const reader = new BufferReader(new Uint8Array([1, 2, 3, 4, 5]))
    reader.skip(3)
    expect(reader.pos).toEqual(3)
  })

  it(BufferReader.prototype.readBytes.name, () => {
    const reader = new BufferReader(new Uint8Array([1, 2, 3, 4, 5]))
    const actual = reader.readBytes(3)
    expect(actual).toEqual(new Uint8Array([1, 2, 3]))
    expect(reader.pos).toEqual(3)

    const actual2 = reader.readBytes(2)
    expect(actual2).toEqual(new Uint8Array([4, 5]))
    expect(reader.pos).toEqual(5)
  })

  it(BufferReader.prototype.readBitList.name, () => {
    const reader = new BufferReader(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    reader.readBitList(7)
    expect(reader.pos).toEqual(1)

    reader.readBitList(13)
    expect(reader.pos).toEqual(3)
  })
})
