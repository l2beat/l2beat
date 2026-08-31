import type { PrivacyAnonymitySetDepositSource } from '@l2beat/config'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import type { PrivacyFlowIndexerConfig, PrivacyRpcLog } from '../types'
import { extractPrivacyAnonymitySetDeposit } from './extractPrivacyAnonymitySetDeposit'
import { extractPrivacyFlow } from './extractPrivacyFlow'

const privacyPoolsInterface = new utils.Interface([
  'event Deposited(address indexed depositor, uint256 commitment, uint256 label, uint256 value, uint256 precommitmentHash)',
  'event Withdrawn(address indexed processooor, uint256 value, uint256 spentNullifier, uint256 newCommitment)',
])

const railgunInterface = new utils.Interface([
  'event Shield(uint256 treeNumber, uint256 startPosition, tuple(bytes32 npk, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint120 value)[] commitments, tuple(bytes32[3] encryptedBundle, bytes32 shieldKey)[] shieldCiphertext, uint256[] fees)',
  'event Unshield(address to, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint256 amount, uint256 fee)',
])

const umbraInterface = new utils.Interface([
  'event Announcement(address indexed receiver, uint256 amount, address indexed token, bytes32 pkx, bytes32 ciphertext)',
  'event TokenWithdrawal(address indexed receiver, address indexed acceptor, uint256 amount, address indexed token)',
])

const zamaInterface = new utils.Interface([
  'event Wrap(address indexed to, uint256 roundedAmount, bytes32 encryptedWrappedAmount)',
  'event UnwrapFinalized(address indexed receiver, bytes32 indexed unwrapRequestId, bytes32 encryptedAmount, uint64 cleartextAmount)',
])

const ADDRESS = EthereumAddress.random()
const TOKEN_ADDRESS = EthereumAddress(
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
)
const OTHER_TOKEN_ADDRESS = EthereumAddress(
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
)
const ETH_TOKEN_PLACEHOLDER = EthereumAddress(
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
)

const baseFlowConfig = {
  id: 'test-id',
  projectId: 'test',
  bucketId: 'test-bucket',
  direction: 'deposit' as const,
  chain: 'ethereum',
  address: ADDRESS,
  event: 'Deposited',
  sinceTimestamp: UnixTime(0),
  priceId: 'ethereum',
  decimals: 18,
}

function encodeLog(
  iface: utils.Interface,
  eventName: string,
  args: unknown[],
): PrivacyRpcLog {
  const encoded = iface.encodeEventLog(eventName, args)
  return {
    address: ADDRESS.toString(),
    data: encoded.data,
    topics: encoded.topics,
  }
}

describe(extractPrivacyFlow.name, () => {
  describe('fixedAmount', () => {
    it('returns the configured fixed amount with count=1', () => {
      const config: PrivacyFlowIndexerConfig = {
        ...baseFlowConfig,
        extractor: 'fixedAmount',
        params: { amount: '1000000000000000000' },
      }
      const log: PrivacyRpcLog = {
        address: ADDRESS.toString(),
        data: '0x',
        topics: [],
      }

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual({ count: 1, amount: 1_000_000_000_000_000_000n })
    })
  })

  describe('privacyPoolsValue', () => {
    it('extracts value from Deposited event', () => {
      const config: PrivacyFlowIndexerConfig = {
        ...baseFlowConfig,
        extractor: 'privacyPoolsValue',
        params: {},
      }
      const depositor = EthereumAddress.random()
      const log = encodeLog(privacyPoolsInterface, 'Deposited', [
        depositor.toString(),
        1n,
        2n,
        12_345n,
        4n,
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual({ count: 1, amount: 12_345n, sender: depositor })
    })

    it('extracts value from Withdrawn event', () => {
      const config: PrivacyFlowIndexerConfig = {
        ...baseFlowConfig,
        direction: 'withdrawal',
        event: 'Withdrawn',
        extractor: 'privacyPoolsValue',
        params: {},
      }
      const log = encodeLog(privacyPoolsInterface, 'Withdrawn', [
        EthereumAddress.random().toString(),
        9_999n,
        1n,
        2n,
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual({ count: 1, amount: 9_999n })
    })
  })

  describe('railgunShield', () => {
    const config: PrivacyFlowIndexerConfig = {
      ...baseFlowConfig,
      event: 'Shield',
      extractor: 'railgunShield',
      params: { tokenAddress: TOKEN_ADDRESS },
    }

    it('sums values of matching ERC20 commitments', () => {
      const log = encodeLog(railgunInterface, 'Shield', [
        1n,
        0n,
        [
          {
            npk: '0x' + '11'.repeat(32),
            token: {
              tokenType: 0, // ERC20
              tokenAddress: TOKEN_ADDRESS.toString(),
              tokenSubID: 0n,
            },
            value: 100n,
          },
          {
            npk: '0x' + '22'.repeat(32),
            token: {
              tokenType: 0, // ERC20
              tokenAddress: TOKEN_ADDRESS.toString(),
              tokenSubID: 0n,
            },
            value: 250n,
          },
        ],
        [],
        [],
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual({ count: 2, amount: 350n })
    })

    it('skips non-ERC20 commitments', () => {
      const log = encodeLog(railgunInterface, 'Shield', [
        1n,
        0n,
        [
          {
            npk: '0x' + '11'.repeat(32),
            token: {
              tokenType: 1, // not ERC20
              tokenAddress: TOKEN_ADDRESS.toString(),
              tokenSubID: 0n,
            },
            value: 100n,
          },
          {
            npk: '0x' + '22'.repeat(32),
            token: {
              tokenType: 0,
              tokenAddress: TOKEN_ADDRESS.toString(),
              tokenSubID: 0n,
            },
            value: 500n,
          },
        ],
        [],
        [],
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual({ count: 1, amount: 500n })
    })

    it('skips commitments with mismatched token address', () => {
      const log = encodeLog(railgunInterface, 'Shield', [
        1n,
        0n,
        [
          {
            npk: '0x' + '11'.repeat(32),
            token: {
              tokenType: 0,
              tokenAddress: OTHER_TOKEN_ADDRESS.toString(),
              tokenSubID: 0n,
            },
            value: 100n,
          },
        ],
        [],
        [],
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual(undefined)
    })

    it('returns undefined when no commitments match', () => {
      const log = encodeLog(railgunInterface, 'Shield', [1n, 0n, [], [], []])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual(undefined)
    })
  })

  describe('railgunUnshield', () => {
    const config: PrivacyFlowIndexerConfig = {
      ...baseFlowConfig,
      direction: 'withdrawal',
      event: 'Unshield',
      extractor: 'railgunUnshield',
      params: { tokenAddress: TOKEN_ADDRESS },
    }

    it('extracts amount from matching ERC20 Unshield event', () => {
      const log = encodeLog(railgunInterface, 'Unshield', [
        EthereumAddress.random().toString(),
        {
          tokenType: 0,
          tokenAddress: TOKEN_ADDRESS.toString(),
          tokenSubID: 0n,
        },
        777n,
        3n,
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual({ count: 1, amount: 777n })
    })

    it('returns undefined for non-ERC20 token type', () => {
      const log = encodeLog(railgunInterface, 'Unshield', [
        EthereumAddress.random().toString(),
        {
          tokenType: 2,
          tokenAddress: TOKEN_ADDRESS.toString(),
          tokenSubID: 0n,
        },
        777n,
        3n,
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual(undefined)
    })

    it('returns undefined when token address does not match', () => {
      const log = encodeLog(railgunInterface, 'Unshield', [
        EthereumAddress.random().toString(),
        {
          tokenType: 0,
          tokenAddress: OTHER_TOKEN_ADDRESS.toString(),
          tokenSubID: 0n,
        },
        777n,
        3n,
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual(undefined)
    })
  })

  describe('umbraAmount', () => {
    const config: PrivacyFlowIndexerConfig = {
      ...baseFlowConfig,
      event: 'Announcement',
      extractor: 'umbraAmount',
      params: { tokenAddress: TOKEN_ADDRESS },
    }

    function announcement(tokenAddress: EthereumAddress, amount: bigint) {
      return encodeLog(umbraInterface, 'Announcement', [
        EthereumAddress.random().toString(),
        amount,
        tokenAddress.toString(),
        '0x' + '11'.repeat(32),
        '0x' + '22'.repeat(32),
      ])
    }

    it('extracts amount from matching Announcement event', () => {
      const result = extractPrivacyFlow(
        config,
        announcement(TOKEN_ADDRESS, 42n),
      )

      expect(result).toEqual({ count: 1, amount: 42n })
    })

    it('returns undefined when the announced token does not match', () => {
      const result = extractPrivacyFlow(
        config,
        announcement(OTHER_TOKEN_ADDRESS, 42n),
      )

      expect(result).toEqual(undefined)
    })

    it('extracts amount from matching TokenWithdrawal event', () => {
      const log = encodeLog(umbraInterface, 'TokenWithdrawal', [
        EthereumAddress.random().toString(),
        EthereumAddress.random().toString(),
        555n,
        TOKEN_ADDRESS.toString(),
      ])

      const result = extractPrivacyFlow(
        { ...config, direction: 'withdrawal', event: 'TokenWithdrawal' },
        log,
      )

      expect(result).toEqual({ count: 1, amount: 555n })
    })

    it('returns undefined when the withdrawn token does not match', () => {
      const log = encodeLog(umbraInterface, 'TokenWithdrawal', [
        EthereumAddress.random().toString(),
        EthereumAddress.random().toString(),
        555n,
        OTHER_TOKEN_ADDRESS.toString(),
      ])

      const result = extractPrivacyFlow(
        { ...config, direction: 'withdrawal', event: 'TokenWithdrawal' },
        log,
      )

      expect(result).toEqual(undefined)
    })

    it('counts an ETH Announcement as both a deposit and a withdrawal', () => {
      const ethConfig: PrivacyFlowIndexerConfig = {
        ...config,
        params: { tokenAddress: ETH_TOKEN_PLACEHOLDER },
      }
      const log = announcement(ETH_TOKEN_PLACEHOLDER, 7n)

      expect(extractPrivacyFlow(ethConfig, log)).toEqual({
        count: 1,
        amount: 7n,
      })
      expect(
        extractPrivacyFlow({ ...ethConfig, direction: 'withdrawal' }, log),
      ).toEqual({ count: 1, amount: 7n })
    })
  })

  describe('zamaWrap', () => {
    it('extracts roundedAmount from Wrap event', () => {
      const config: PrivacyFlowIndexerConfig = {
        ...baseFlowConfig,
        event: 'Wrap',
        extractor: 'zamaWrap',
        params: {},
      }
      const log = encodeLog(zamaInterface, 'Wrap', [
        EthereumAddress.random().toString(),
        123_456n,
        '0x' + '11'.repeat(32),
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual({ count: 1, amount: 123_456n })
    })
  })

  describe('zamaUnwrap', () => {
    it('extracts cleartextAmount multiplied by wrapper rate', () => {
      const config: PrivacyFlowIndexerConfig = {
        ...baseFlowConfig,
        direction: 'withdrawal',
        event: 'UnwrapFinalized',
        extractor: 'zamaUnwrap',
        params: { rate: '10' },
      }
      const log = encodeLog(zamaInterface, 'UnwrapFinalized', [
        EthereumAddress.random().toString(),
        '0x' + '22'.repeat(32),
        '0x' + '33'.repeat(32),
        987n,
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual({ count: 1, amount: 9_870n })
    })
  })
})

describe(extractPrivacyAnonymitySetDeposit.name, () => {
  it('uses the event depositor for Privacy Pools deposits', () => {
    const source = {
      event: 'Deposited',
      extractor: 'privacyPoolsValue',
      params: {},
    } satisfies PrivacyAnonymitySetDepositSource
    const depositor = EthereumAddress.random()
    const log = encodeLog(privacyPoolsInterface, 'Deposited', [
      depositor.toString(),
      1n,
      2n,
      12_345n,
      4n,
    ])

    expect(extractPrivacyAnonymitySetDeposit(source, log)).toEqual({
      amount: 12_345n,
      origin: { type: 'event', sender: depositor },
    })
  })

  it('does not fall back to the transaction sender for Privacy Pools', () => {
    const source = {
      event: 'Withdrawn',
      extractor: 'privacyPoolsValue',
      params: {},
    } satisfies PrivacyAnonymitySetDepositSource
    const log = encodeLog(privacyPoolsInterface, 'Withdrawn', [
      EthereumAddress.random().toString(),
      9_999n,
      1n,
      2n,
    ])

    expect(() => extractPrivacyAnonymitySetDeposit(source, log)).toThrow(
      'Privacy Pools deposit is missing depositor',
    )
  })

  it('requests the transaction sender for fixed deposits', () => {
    const source = {
      event: 'Deposit',
      extractor: 'fixedAmount',
      params: { amount: '100' },
    } satisfies PrivacyAnonymitySetDepositSource

    expect(
      extractPrivacyAnonymitySetDeposit(source, {
        address: ADDRESS.toString(),
        data: '0x',
        topics: [],
      }),
    ).toEqual({ amount: 100n, origin: { type: 'transaction' } })
  })
})
