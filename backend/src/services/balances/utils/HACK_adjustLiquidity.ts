import { BigNumber } from 'ethers'

const PNK = '0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d'
const CAT = '0x1234567461d3f8Db7496581774Bd869C83D51c93'
const SPANK = '0x42d6622deCe394b54999Fbd73D108123806f6a18'

const TEN_CAT = BigNumber.from(10).pow(19)

export function HACK_adjustLiquidity(
  dex: 'v1' | 'v2' | 'v3',
  token: string,
  liquidity: BigNumber
) {
  if (token === SPANK) {
    // There is something very wrong with the price of this token on Uniswap V1
    // Needs more investigation. Look at OMG Network holdings
    // Interesting dates: 2020-06-13, 2020-06-14 and 2020-08-15, 2020-08-16
    if (dex === 'v1') {
      return liquidity.div(10000)
    }
  } else if (token === CAT) {
    // This token was only on Uniswap V2, but the liquidity was very small and
    // so the price was unreliable
    // Interesting dates: 2020-10-09', 2020-10-10, 2020-10-11
    if (liquidity.lt(TEN_CAT)) {
      return BigNumber.from(0)
    }
  } else if (token === PNK) {
    // There is something very wrong with the price of this token on Uniswap V1
    // Needs more investigation. Look at DeversiFi PNK holdings
    // Interesting dates: 2020-06-02, 2020-06-03 and 2020-09-12, 2020-09-13
    if (dex === 'v1') {
      return liquidity.div(1000)
    }
  }
  return liquidity
}
