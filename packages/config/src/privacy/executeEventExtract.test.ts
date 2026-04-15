import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { executeEventExtract } from './executeEventExtract'
import type { PrivacyRpcLog } from './types'

const railgunInterface = new utils.Interface([
  'event Shield(uint256 treeNumber, uint256 startPosition, tuple(bytes32 npk, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint120 value)[] commitments, tuple(bytes32[3] encryptedBundle, bytes32 shieldKey)[] shieldCiphertext, uint256[] fees)',
])

const WETH = EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
const DAI = EthereumAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')
const RAILGUN_CORE = '0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9'

describe(executeEventExtract.name, () => {
  it('counts matching ERC20 commitments inside Shield events', () => {
    const result = executeEventExtract(
      {
        type: 'eventExtract',
        chain: 'ethereum',
        event:
          '0x3a5b9dc26075a3801a6ddccf95fec485bb7500a91b44cec1add984c21ee6db3b',
        address: ChainSpecificAddress(`eth:${RAILGUN_CORE}`),
        extractor: 'railgunShieldDeposits',
        params: {
          tokenAddress: WETH,
        },
      },
      [
        makeShieldLog([
          makeCommitment({ tokenType: 0, tokenAddress: WETH, value: 10 }),
          makeCommitment({ tokenType: 0, tokenAddress: DAI, value: 20 }),
          makeCommitment({ tokenType: 0, tokenAddress: WETH, value: 30 }),
          makeCommitment({ tokenType: 1, tokenAddress: WETH, value: 1 }),
        ]),
        makeShieldLog([
          makeCommitment({ tokenType: 0, tokenAddress: WETH, value: 40 }),
        ]),
      ],
    )

    expect(result).toEqual(3)
  })

  it('returns zero when no matching commitments are present', () => {
    const result = executeEventExtract(
      {
        type: 'eventExtract',
        chain: 'ethereum',
        event:
          '0x3a5b9dc26075a3801a6ddccf95fec485bb7500a91b44cec1add984c21ee6db3b',
        address: ChainSpecificAddress(`eth:${RAILGUN_CORE}`),
        extractor: 'railgunShieldDeposits',
        params: {
          tokenAddress: DAI,
        },
      },
      [
        makeShieldLog([
          makeCommitment({ tokenType: 0, tokenAddress: WETH, value: 10 }),
          makeCommitment({ tokenType: 2, tokenAddress: DAI, value: 1 }),
        ]),
      ],
    )

    expect(result).toEqual(0)
  })

  it('throws a readable error when logs do not match the Railgun Shield ABI', () => {
    expect(() =>
      executeEventExtract(
        {
          type: 'eventExtract',
          chain: 'ethereum',
          event:
            '0x3a5b9dc26075a3801a6ddccf95fec485bb7500a91b44cec1add984c21ee6db3b',
          address: ChainSpecificAddress(`eth:${RAILGUN_CORE}`),
          extractor: 'railgunShieldDeposits',
          params: {
            tokenAddress: WETH,
          },
        },
        [
          {
            address: RAILGUN_CORE,
            data: '0x1234',
            topics: [
              '0x3a5b9dc26075a3801a6ddccf95fec485bb7500a91b44cec1add984c21ee6db3b',
            ],
          },
        ],
      ),
    ).toThrow('Failed to parse Railgun Shield log')
  })
})

function makeShieldLog(
  commitments: ReturnType<typeof makeCommitment>[],
): PrivacyRpcLog {
  const encoded = railgunInterface.encodeEventLog(
    railgunInterface.getEvent('Shield'),
    [1, 0, commitments, [], []],
  )

  return {
    address: RAILGUN_CORE,
    data: encoded.data,
    topics: encoded.topics,
  }
}

function makeCommitment({
  tokenType,
  tokenAddress,
  tokenSubID = 0,
  value,
}: {
  tokenType: number
  tokenAddress: EthereumAddress
  tokenSubID?: number
  value: number
}) {
  return {
    npk: utils.hexZeroPad('0x01', 32),
    token: {
      tokenType,
      tokenAddress,
      tokenSubID,
    },
    value,
  }
}
