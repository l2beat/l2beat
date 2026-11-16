import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { getMarketQuote } from './marketQuotes'

const TOKEN = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const POOL = ChainSpecificAddress(
  'eth:0x2222222222222222222222222222222222222222',
)
const OUT = 10n ** 20n

describe(getMarketQuote.name, () => {
  it('takes the first word, as the quoter returns more after it', () => {
    const { decode } = getMarketQuote(TOKEN, { type: 'uniswapV3', fee: 100 })
    const data = utils.defaultAbiCoder.encode(
      ['uint256', 'uint160', 'uint32', 'uint256'],
      [OUT, 1, 2, 3],
    )

    expect(decode({ success: true, data: Bytes.fromHex(data) })).toEqual(OUT)
  })

  it('gives nothing for a pool that does not exist yet or reverts', () => {
    const { decode } = getMarketQuote(TOKEN, {
      type: 'curve',
      pool: POOL,
      i: 1,
      j: 0,
    })

    expect(decode({ success: true, data: Bytes.EMPTY })).toEqual(undefined)
    expect(decode({ success: false, data: Bytes.EMPTY })).toEqual(undefined)
  })

  it('reads the Fluid swap result from its revert', () => {
    const { decode } = getMarketQuote(TOKEN, {
      type: 'fluid',
      pool: POOL,
      swap0to1: true,
    })
    const revert = Bytes.fromHex(
      `0xb3bfda99${utils.defaultAbiCoder.encode(['uint256'], [OUT]).slice(2)}`,
    )

    expect(decode({ success: false, data: revert })).toEqual(OUT)
    expect(decode({ success: false, data: Bytes.EMPTY })).toEqual(undefined)
  })
})
