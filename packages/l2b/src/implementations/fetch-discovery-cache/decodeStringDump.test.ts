import { expect } from 'earl'
import { decodeStringDump } from './decodeStringDump'

describe(decodeStringDump.name, () => {
  it('decodes a raw string dumped by Dragonfly', () => {
    const dump = Buffer.from(
      '0040ba7b227472616e73616374696f6e48617368223a223078643966613233323465373436306262303361616235333061306161373264306439626436653032396236646334636261363031353834353538313834613437' +
        '35222c226465706c6f796572223a22307832443062394137313141383837453861353637383430306232333131303132664542394265424639222c22626c6f636b4e756d626572223a313532332c2274696d657374616d70' +
        '223a313736333530343834307d09003e9fe85d15d12526',
      'hex',
    )

    expect(decodeStringDump(dump)).toEqual(
      JSON.stringify({
        transactionHash:
          '0xd9fa2324e7460bb03aab530a0aa72d0d9bd6e029b6dc4cba601584558184a475',
        deployer: '0x2D0b9A711A887E8a5678400b2311012fEB9BeBF9',
        blockNumber: 1523,
        timestamp: 1763504840,
      }),
    )
  })

  it('decodes an LZF compressed string dumped by Dragonfly', () => {
    const dump = Buffer.from(
      '00c3405240b7167b227472616e73616374696f6e48617368223a22307830e036000a222c226465706c6f796572e0244f203708626c6f636b4e756d62403a18302c2274696d657374616d70223a313733303734383336307d' +
        '0900c3db7e152de8dd89',
      'hex',
    )

    expect(decodeStringDump(dump)).toEqual(
      JSON.stringify({
        transactionHash: `0x${'0'.repeat(64)}`,
        deployer: `0x${'0'.repeat(40)}`,
        blockNumber: 0,
        timestamp: 1730748360,
      }),
    )
  })

  it('decodes integer encoded strings', () => {
    const dragonflyDump = Buffer.from('00c2568889010900a02665ef628ca7de', 'hex')

    expect(decodeStringDump(dragonflyDump)).toEqual('25790550')
    expect(decodeStringDump(withTrailer('00c0ff'))).toEqual('-1')
    expect(decodeStringDump(withTrailer('00c13930'))).toEqual('12345')
  })

  it('decodes overlapping and long LZF back references', () => {
    const overlapping = withTrailer('00c3060902616263' + '8002')
    const long = withTrailer('00c3050f0061' + 'e00500')

    expect(decodeStringDump(overlapping)).toEqual('abcabcabc')
    expect(decodeStringDump(long)).toEqual('a'.repeat(15))
  })

  it('rejects dumps that are not strings', () => {
    expect(() => decodeStringDump(withTrailer('0e00'))).toThrow(
      'Dump is not a string',
    )
  })

  it('rejects truncated dumps', () => {
    const truncated = withTrailer('00c3060902616263').subarray(0, -1)

    expect(() => decodeStringDump(truncated)).toThrow()
  })

  it('rejects LZF data that disagrees with its declared length', () => {
    const tooLong = withTrailer('00c3060802616263' + '8002')
    const tooShort = withTrailer('00c3060a02616263' + '8002')

    expect(() => decodeStringDump(tooLong)).toThrow('LZF output overrun')
    expect(() => decodeStringDump(tooShort)).toThrow(
      'LZF output shorter than declared',
    )
  })

  it('rejects LZF references before the start of the output', () => {
    const dump = withTrailer('00c302032000')

    expect(() => decodeStringDump(dump)).toThrow(
      'LZF reference before output start',
    )
  })
})

function withTrailer(payloadHex: string): Buffer {
  return Buffer.concat([Buffer.from(payloadHex, 'hex'), Buffer.alloc(10)])
}
