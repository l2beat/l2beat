import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import type { PrivacyFlowIndexerConfig, PrivacyRpcLog } from '../types'
import { extractPrivacyFlow } from './extractPrivacyFlow'

const privacyPoolsInterface = new utils.Interface([
  'event Deposited(address indexed depositor, uint256 commitment, uint256 label, uint256 value, uint256 precommitmentHash)',
  'event Withdrawn(address indexed processooor, uint256 value, uint256 spentNullifier, uint256 newCommitment)',
])

const railgunInterface = new utils.Interface([
  'event Shield(uint256 treeNumber, uint256 startPosition, tuple(bytes32 npk, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint120 value)[] commitments, tuple(bytes32[3] encryptedBundle, bytes32 shieldKey)[] shieldCiphertext, uint256[] fees)',
  'event Unshield(address to, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint256 amount, uint256 fee)',
])

const ADDRESS = EthereumAddress.random()
const TOKEN_ADDRESS = EthereumAddress(
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
)
const OTHER_TOKEN_ADDRESS = EthereumAddress(
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
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
      const log = encodeLog(privacyPoolsInterface, 'Deposited', [
        EthereumAddress.random().toString(),
        1n,
        2n,
        12_345n,
        4n,
      ])

      const result = extractPrivacyFlow(config, log)

      expect(result).toEqual({ count: 1, amount: 12_345n })
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
})
