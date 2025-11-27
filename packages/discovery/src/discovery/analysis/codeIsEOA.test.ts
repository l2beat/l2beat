import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { codeIsEOA } from './codeIsEOA.js'

describe(codeIsEOA.name, () => {
  it('empty code is EOA', () => {
    expect(codeIsEOA(Bytes.randomOfLength(0))).toBeTruthy()
  })

  it('EIP7702 code is EOA', () => {
    const prefix = Bytes.fromHex('0xef0100')
    const address = EthereumAddress.random().toString()
    const code = prefix.concat(Bytes.fromHex(address))
    expect(codeIsEOA(code)).toBeTruthy()
  })

  it('throws for invalid EIP7702 prefix', () => {
    const prefix = Bytes.fromHex('0xef0200')
    const address = EthereumAddress.random().toString()
    const code = prefix.concat(Bytes.fromHex(address))
    expect(() => codeIsEOA(code)).toThrow()
  })

  it('throws for too wrong EIP7702 code size', () => {
    const prefix = Bytes.fromHex('0xef0100')
    const tooShort = prefix.concat(Bytes.randomOfLength(19))
    const tooLong = prefix.concat(Bytes.randomOfLength(21))
    expect(() => codeIsEOA(tooShort)).toThrow()
    expect(() => codeIsEOA(tooLong)).toThrow()
  })

  it('random code is not EOA', () => {
    // NOTE(radomski): Otherwise this test is not deterministic
    const prefix = Bytes.fromHex('0x6060')
    expect(codeIsEOA(prefix.concat(Bytes.randomOfLength(128)))).toBeFalsy()
  })
})
