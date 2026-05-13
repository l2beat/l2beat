import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { executeFlowExtract } from './executeFlowExtract'
import type { PrivacyRpcLog } from './types'

const railgunInterface = new utils.Interface([
  'event Shield(uint256 treeNumber, uint256 startPosition, tuple(bytes32 npk, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint120 value)[] commitments, tuple(bytes32[3] encryptedBundle, bytes32 shieldKey)[] shieldCiphertext, uint256[] fees)',
  'event Unshield(address to, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint256 amount, uint256 fee)',
])

const privacyPoolsInterface = new utils.Interface([
  'event Deposited(address indexed _depositor, uint256 _commitment, uint256 _label, uint256 _value, uint256 _precommitmentHash)',
  'event Withdrawn(address indexed _processooor, uint256 _value, uint256 _spentNullifier, uint256 _newCommitment)',
])

const WETH = EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
const DAI = EthereumAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')
const RAILGUN_CORE = '0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9'
const PRIVACY_POOL = '0x1111111111111111111111111111111111111111'

describe(executeFlowExtract.name, () => {
  it('counts fixed-amount events and returns their configured amount', () => {
    const result = executeFlowExtract(
      {
        chain: 'ethereum',
        event:
          '0xa945e51eec50ab98c161376f0db4cf2aeba3ec92755fe2fcd388bdbbb80ff196',
        address: ChainSpecificAddress(`eth:${PRIVACY_POOL}`),
        extractor: 'fixedAmount',
        params: {
          amount: '100000000000000000',
        },
      },
      {
        address: PRIVACY_POOL,
        data: '0x',
        topics: [],
      },
    )

    expect(result).toEqual({
      count: 1,
      amount: 100000000000000000n,
    })
  })

  it('extracts matching Railgun Shield commitments into count and amount', () => {
    const result = executeFlowExtract(
      {
        chain: 'ethereum',
        event:
          '0x3a5b9dc26075a3801a6ddccf95fec485bb7500a91b44cec1add984c21ee6db3b',
        address: ChainSpecificAddress(`eth:${RAILGUN_CORE}`),
        extractor: 'railgunShield',
        params: {
          tokenAddress: WETH,
        },
      },
      makeShieldLog([
        makeCommitment({ tokenType: 0, tokenAddress: WETH, value: 10 }),
        makeCommitment({ tokenType: 0, tokenAddress: DAI, value: 20 }),
        makeCommitment({ tokenType: 0, tokenAddress: WETH, value: 30 }),
        makeCommitment({ tokenType: 1, tokenAddress: WETH, value: 1 }),
      ]),
    )

    expect(result).toEqual({
      count: 2,
      amount: 40n,
    })
  })

  it('extracts matching Railgun Unshield events into count and amount', () => {
    const result = executeFlowExtract(
      {
        chain: 'ethereum',
        event:
          '0xd93cf895c7d5b2cd7dc7a098b678b3089f37d91f48d9b83a0800a91cbdf05284',
        address: ChainSpecificAddress(`eth:${RAILGUN_CORE}`),
        extractor: 'railgunUnshield',
        params: {
          tokenAddress: WETH,
        },
      },
      makeUnshieldLog({
        tokenType: 0,
        tokenAddress: WETH,
        amount: 25,
      }),
    )

    expect(result).toEqual({
      count: 1,
      amount: 25n,
    })
  })

  it('extracts Privacy Pools values from deposit and withdrawal logs', () => {
    const depositResult = executeFlowExtract(
      {
        chain: 'ethereum',
        event:
          '0xe3b53cd1a44fbf11535e145d80b8ef1ed6d57a73bf5daa7e939b6b01657d6549',
        address: ChainSpecificAddress(`eth:${PRIVACY_POOL}`),
        extractor: 'privacyPoolsValue',
        params: {},
      },
      makePrivacyPoolsLog('Deposited', [PRIVACY_POOL, 1, 2, 75, 3]),
    )

    const withdrawalResult = executeFlowExtract(
      {
        chain: 'ethereum',
        event:
          '0x75e161b3e824b114fc1a33274bd7091918dd4e639cede50b78b15a4eea956a21',
        address: ChainSpecificAddress(`eth:${PRIVACY_POOL}`),
        extractor: 'privacyPoolsValue',
        params: {},
      },
      makePrivacyPoolsLog('Withdrawn', [PRIVACY_POOL, 90, 1, 2]),
    )

    expect(depositResult).toEqual({
      count: 1,
      amount: 75n,
    })
    expect(withdrawalResult).toEqual({
      count: 1,
      amount: 90n,
    })
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

function makeUnshieldLog({
  tokenType,
  tokenAddress,
  amount,
}: {
  tokenType: number
  tokenAddress: EthereumAddress
  amount: number
}): PrivacyRpcLog {
  const encoded = railgunInterface.encodeEventLog(
    railgunInterface.getEvent('Unshield'),
    [
      PRIVACY_POOL,
      {
        tokenType,
        tokenAddress,
        tokenSubID: 0,
      },
      amount,
      0,
    ],
  )

  return {
    address: RAILGUN_CORE,
    data: encoded.data,
    topics: encoded.topics,
  }
}

function makePrivacyPoolsLog(
  event: 'Deposited' | 'Withdrawn',
  args: unknown[],
): PrivacyRpcLog {
  const encoded = privacyPoolsInterface.encodeEventLog(
    privacyPoolsInterface.getEvent(event),
    args,
  )

  return {
    address: PRIVACY_POOL,
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
