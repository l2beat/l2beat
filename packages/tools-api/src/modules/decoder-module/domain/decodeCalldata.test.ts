import { randomBytes } from 'crypto'
import { expect } from 'earl'
import { deflateRawSync } from 'zlib'
import { calldataBytesMax, decodeCalldata } from './decodeCalldata'

describe(decodeCalldata.name, () => {
  it('decodes incompressible calldata of the maximum size', () => {
    const calldata = randomBytes(calldataBytesMax)

    const decoded = decodeCalldata(encode(calldata))

    expect(decoded).toEqual(`0x${calldata.toString('hex')}`)
  })

  it('rejects calldata one byte over the maximum size', () => {
    const calldata = Buffer.alloc(calldataBytesMax + 1)

    expect(() => decodeCalldata(encode(calldata))).toThrow('Calldata too long')
  })

  it('rejects an encoded string too long to fit the maximum size', () => {
    const calldata = randomBytes(calldataBytesMax + 2048)

    expect(() => decodeCalldata(encode(calldata))).toThrow('Calldata too long')
  })
})

function encode(calldata: Buffer): string {
  return deflateRawSync(calldata).toString('base64url')
}
