import * as fs from 'fs'
import { expect } from 'earl'
import { BigNumber } from 'ethers'
import { byteArrFromHexStr } from '../../utils/byteArrFromHexStr'
import { decodeBatch } from './batch'

describe(decodeBatch.name, () => {
  it('decode batch with empty gas price', async () => {
    const mockTs = fs.readFileSync(
      'src/test/data/finality-txs-polygonzkevm.txt',
      'utf-8',
    )
    const result = decodeBatch(byteArrFromHexStr(mockTs))

    expect(result.length).toEqual(66)
    expect(result[59].transactions.length).toEqual(7)
    expect(result[59].transactions[1]).toEqual({
      nonce: BigNumber.from('0x00'),
      gasPrice: BigNumber.from('0x00'),
      gasLimit: BigNumber.from('0xc899'),
      to: '0x1E4a5963aBFD975d8c9021ce480b42188849D41d',
      value: BigNumber.from('0x00'),
      data: '0xa9059cbb000000000000000000000000c0d62a6eda3f8834c892bd41126e78d17c14dda50000000000000000000000000000000000000000000000000000000000d25720',
      chainId: BigNumber.from('0x044d'),
      v: BigNumber.from('0x08bd'),
      r: BigNumber.from(
        '0x15015f155264cf125e4a001c0dfb7661c166da3b95f609cb673b952ab12d5262',
      ),
      s: BigNumber.from(
        '0x2a8a88b520e2c74aa7bc23a346ee81506a51f1520a8fa184802eec0fe353e69a',
      ),
    })
  })
})
