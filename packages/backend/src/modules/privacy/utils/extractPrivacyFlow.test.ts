import {
  type PrivacyAnonymitySetDepositSource,
  ProjectService,
} from '@l2beat/config'
import type { IRpcClient } from '@l2beat/shared'
import { EthereumAddress, type Log, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import type {
  EvmPrivacyAnonymitySetSource,
  PrivacyFlowIndexerConfig,
  PrivacyRpcLog,
} from '../types'
import { FUNDING_PARAMS } from '../zkmoney/test/fixtures'
import { erc20Interface } from './erc20'
import { extractPrivacyAnonymitySetMember } from './extractPrivacyAnonymitySetMember'
import {
  extractPrivacyFlow,
  extractPrivacyFlowWithContext,
} from './extractPrivacyFlow'
import { ReceiptLogCache } from './ReceiptLogCache'

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

const umbraRegistryInterface = new utils.Interface([
  'event StealthKeyChanged(address indexed registrant, uint256 spendingPubKeyPrefix, uint256 spendingPubKey, uint256 viewingPubKeyPrefix, uint256 viewingPubKey)',
])

const zkMoneyInterface = new utils.Interface([
  'event Deposit(bytes32 indexed recipientCommitment, uint256 amount, bytes32 key, uint256 index)',
  'event WithdrawalOrRefund(uint8 indexed flow, bytes32 indexed nullifier, address indexed executor, uint256 executionAmount)',
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
  describe('zkapi native ETH events', () => {
    const iface = new utils.Interface([
      'event NoteDeposited(uint32 indexed noteId, bytes32 indexed commitment, uint128 amount, uint64 expiryTs, uint256 newRoot)',
      'event MutualClose(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination)',
      'event EscapeWithdrawalFinalized(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination)',
      'event EscapeWithdrawalInitiated(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination, uint64 challengeDeadline, uint256 newRoot)',
    ])
    const params = { weiPerUnit: '1000000000' }

    it('converts deposits from gwei to wei without losing integer precision', () => {
      const amount = 9_007_199_254_740_991n
      const log = encodeLog(iface, 'NoteDeposited', [
        30,
        utils.hexZeroPad('0x01', 32),
        amount,
        1_793_404_800,
        123,
      ])
      expect(
        extractPrivacyFlow(
          { event: log.topics[0]!, extractor: 'zkApiDeposit', params },
          log,
        ),
      ).toEqual({ count: 1, amount: amount * 1_000_000_000n })
    })

    for (const event of ['MutualClose', 'EscapeWithdrawalFinalized']) {
      it(`counts only the user payout in ${event}`, () => {
        const log = encodeLog(iface, event, [7, 123, 23_456_789n, ADDRESS])
        expect(
          extractPrivacyFlow(
            { event: log.topics[0]!, extractor: 'zkApiWithdrawal', params },
            log,
          ),
        ).toEqual({ count: 1, amount: 23_456_789_000_000_000n })
      })
    }

    it('counts a zero-balance closure without inventing a payout', () => {
      const log = encodeLog(iface, 'MutualClose', [7, 123, 0, ADDRESS])
      expect(
        extractPrivacyFlow(
          { event: log.topics[0]!, extractor: 'zkApiWithdrawal', params },
          log,
        ),
      ).toEqual({ count: 1, amount: 0n })
    })

    it('rejects escape initiation because no payout has happened', () => {
      const log = encodeLog(iface, 'EscapeWithdrawalInitiated', [
        7,
        123,
        23_456_789n,
        ADDRESS,
        1_793_404_800,
        456,
      ])
      expect(() =>
        extractPrivacyFlow(
          { event: log.topics[0]!, extractor: 'zkApiWithdrawal', params },
          log,
        ),
      ).toThrow()
    })
  })

  describe('zk.money portal events', () => {
    it('counts the credited deposit amount', () => {
      const log = encodeLog(zkMoneyInterface, 'Deposit', [
        utils.hexZeroPad('0x01', 32),
        1_234_567_890_123_456_789_012n,
        utils.hexZeroPad('0x02', 32),
        1,
      ])

      expect(
        extractPrivacyFlow(
          {
            extractor: 'zkMoneyDeposit',
            event: log.topics[0]!,
            params: FUNDING_PARAMS,
          },
          log,
        ),
      ).toEqual({ count: 1, amount: 1_234_567_890_123_456_789_012n })
    })

    // Flow 0 is a withdrawal, flows 1–3 are the three refund routes.
    for (const flow of [0, 1, 2, 3]) {
      it(`counts flow ${flow} with any executor and no additional fee subtraction`, () => {
        const log = encodeLog(zkMoneyInterface, 'WithdrawalOrRefund', [
          flow,
          utils.hexZeroPad('0x03', 32),
          OTHER_TOKEN_ADDRESS,
          1_234_567_890_123_456_789_012n,
        ])

        expect(log.topics[0]).toEqual(
          '0x0ef2e2e9f18042ca214d1bee833209f28326ffa8f4a6b0dc92172caf71bc5433',
        )
        expect(
          extractPrivacyFlow(
            {
              extractor: 'zkMoneyWithdrawal',
              event: log.topics[0]!,
              params: {},
            },
            log,
          ),
        ).toEqual({ count: 1, amount: 1_234_567_890_123_456_789_012n })
      })
    }
  })

  describe('erc20Transfer', () => {
    const config: PrivacyFlowIndexerConfig = {
      ...baseFlowConfig,
      event: 'Transfer',
      extractor: 'erc20Transfer',
      params: { to: ADDRESS },
    }

    it('returns the transferred value with count=1', () => {
      const log = encodeLog(erc20Interface, 'Transfer', [
        TOKEN_ADDRESS,
        ADDRESS,
        1500n,
      ])

      expect(extractPrivacyFlow(config, log)).toEqual({
        count: 1,
        amount: 1500n,
      })
    })

    it('ignores zero-value transfers', () => {
      const log = encodeLog(erc20Interface, 'Transfer', [
        TOKEN_ADDRESS,
        ADDRESS,
        0n,
      ])

      expect(extractPrivacyFlow(config, log)).toEqual(undefined)
    })

    it('ignores self transfers', () => {
      const log = encodeLog(erc20Interface, 'Transfer', [
        ADDRESS,
        ADDRESS,
        1500n,
      ])

      expect(extractPrivacyFlow(config, log)).toEqual(undefined)
    })

    it('ignores transfers whose recipient is not the configured `to`', () => {
      const log = encodeLog(erc20Interface, 'Transfer', [
        TOKEN_ADDRESS,
        OTHER_TOKEN_ADDRESS,
        1500n,
      ])

      expect(extractPrivacyFlow(config, log)).toEqual(undefined)
    })

    it('ignores transfers whose sender is not the configured `from`', () => {
      const log = encodeLog(erc20Interface, 'Transfer', [
        OTHER_TOKEN_ADDRESS,
        TOKEN_ADDRESS,
        1500n,
      ])

      expect(
        extractPrivacyFlow({ ...config, params: { from: ADDRESS } }, log),
      ).toEqual(undefined)
    })
  })

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

  describe('privacyPoolsV2Value', () => {
    const iface = new utils.Interface([
      'event Deposited(uint256 outputCommitment, address indexed asset, uint256 depositedValue, address indexed caller)',
      'event Transacted(uint256[] outputCommitments, uint256[] nullifierHashes, address indexed asset, uint256 withdrawnValue, address indexed caller)',
      'event Ragequit(address indexed ragequitter, address indexed asset, uint256 value, uint256 commitment, uint256 nullifierHash, uint256 label)',
    ])
    const params = { tokenAddress: TOKEN_ADDRESS }

    it('extracts a deposit of the configured asset', () => {
      const log = encodeLog(iface, 'Deposited', [
        1,
        TOKEN_ADDRESS,
        500n,
        ADDRESS,
      ])
      expect(
        extractPrivacyFlow(
          { event: log.topics[0]!, extractor: 'privacyPoolsV2Value', params },
          log,
        ),
      ).toEqual({ count: 1, amount: 500n })
    })

    it('extracts the withdrawn value of a transact', () => {
      const log = encodeLog(iface, 'Transacted', [
        [1, 2],
        [3],
        TOKEN_ADDRESS,
        700n,
        ADDRESS,
      ])
      expect(
        extractPrivacyFlow(
          { event: log.topics[0]!, extractor: 'privacyPoolsV2Value', params },
          log,
        ),
      ).toEqual({ count: 1, amount: 700n })
    })

    it('extracts a ragequit', () => {
      const log = encodeLog(iface, 'Ragequit', [
        ADDRESS,
        TOKEN_ADDRESS,
        900n,
        1,
        2,
        3,
      ])
      expect(
        extractPrivacyFlow(
          { event: log.topics[0]!, extractor: 'privacyPoolsV2Value', params },
          log,
        ),
      ).toEqual({ count: 1, amount: 900n })
    })

    it('ignores another asset of the same vault', () => {
      const log = encodeLog(iface, 'Deposited', [
        1,
        OTHER_TOKEN_ADDRESS,
        500n,
        ADDRESS,
      ])
      expect(
        extractPrivacyFlow(
          { event: log.topics[0]!, extractor: 'privacyPoolsV2Value', params },
          log,
        ),
      ).toEqual(undefined)
    })

    it('ignores a pure private transfer, which withdraws nothing', () => {
      const log = encodeLog(iface, 'Transacted', [
        [1],
        [2],
        EthereumAddress.ZERO,
        0n,
        ADDRESS,
      ])
      expect(
        extractPrivacyFlow(
          { event: log.topics[0]!, extractor: 'privacyPoolsV2Value', params },
          log,
        ),
      ).toEqual(undefined)
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
})

describe(extractPrivacyFlowWithContext.name, () => {
  const vaultInterface = new utils.Interface([
    'event Deposited(uint256 outputCommitment, address indexed asset, uint256 depositedValue, address indexed caller)',
    'event Transacted(uint256[] outputCommitments, uint256[] nullifierHashes, address indexed asset, uint256 withdrawnValue, address indexed caller)',
    'function transact((uint256[2] pA, uint256[2][2] pB, uint256[2] pC, uint256[][] pubSignals) _proof, (address processor, bytes data) _transactParams, (bytes32 hint, bytes data)[] _noteData)',
  ])
  const RELAYER = EthereumAddress('0x2222222222222222222222222222222222222222')
  const RECIPIENT = EthereumAddress(
    '0x3333333333333333333333333333333333333333',
  )
  const PROCESSOR = EthereumAddress(
    '0x4444444444444444444444444444444444444444',
  )

  it('drops a relayed transfer, which pays only the fee to its relayer', async () => {
    const log = transactedLog(10n)
    const result = await extractPrivacyFlowWithContext(
      source(log),
      log,
      contextWith(ADDRESS, transactCalldata(payout(RELAYER, RELAYER, 0n))),
    )
    expect(result).toEqual(undefined)
  })

  it('keeps a withdrawal routed through a processor contract', async () => {
    const log = transactedLog(700n)
    const result = await extractPrivacyFlowWithContext(
      source(log),
      log,
      contextWith(PROCESSOR, transactCalldata(payout(RELAYER, RELAYER, 0n))),
    )
    expect(result).toEqual({ count: 1, amount: 700n })
  })

  it('keeps a direct withdrawal that binds no payout routing', async () => {
    const log = transactedLog(700n)
    const result = await extractPrivacyFlowWithContext(
      source(log),
      log,
      contextWith(ADDRESS, transactCalldata('0x')),
    )
    expect(result).toEqual({ count: 1, amount: 700n })
  })

  it('keeps a direct withdrawal whose payout pays a fee', async () => {
    const log = transactedLog(700n)
    const result = await extractPrivacyFlowWithContext(
      source(log),
      log,
      contextWith(ADDRESS, transactCalldata(payout(RECIPIENT, RELAYER, 5n))),
    )
    expect(result).toEqual({ count: 1, amount: 700n })
  })

  it('reads no transaction for a deposit', async () => {
    const log = toLog(
      encodeLog(vaultInterface, 'Deposited', [1, TOKEN_ADDRESS, 500n, ADDRESS]),
    )
    const rpc = mockObject<IRpcClient>({})
    const result = await extractPrivacyFlowWithContext(source(log), log, {
      rpc,
      receipts: new ReceiptLogCache(rpc),
    })
    expect(result).toEqual({ count: 1, amount: 500n })
  })

  function source(log: Log) {
    return {
      event: log.topics[0]!,
      extractor: 'privacyPoolsV2Value' as const,
      params: { tokenAddress: TOKEN_ADDRESS },
    }
  }

  function transactedLog(withdrawnValue: bigint): Log {
    return toLog(
      encodeLog(vaultInterface, 'Transacted', [
        [1, 2],
        [3],
        TOKEN_ADDRESS,
        withdrawnValue,
        RELAYER,
      ]),
    )
  }

  function payout(
    recipient: EthereumAddress,
    feeRecipient: EthereumAddress,
    feeAmount: bigint,
  ): string {
    return utils.defaultAbiCoder.encode(
      ['tuple(address, address, uint256, uint256)'],
      [[recipient, feeRecipient, feeAmount, 0n]],
    )
  }

  function transactCalldata(data: string): string {
    return vaultInterface.encodeFunctionData('transact', [
      [
        [1, 2],
        [
          [3, 4],
          [5, 6],
        ],
        [7, 8],
        [[9]],
      ],
      [RELAYER, data],
      [],
    ])
  }

  function contextWith(to: EthereumAddress, data: string) {
    const rpc = mockObject<IRpcClient>({
      getTransaction: mockFn<IRpcClient['getTransaction']>().resolvesTo({
        hash: `0x${'bb'.repeat(32)}`,
        value: undefined,
        from: RELAYER.toString(),
        to: to.toString(),
        data,
        type: undefined,
        calls: undefined,
        blobVersionedHashes: undefined,
        blockNumber: 100,
      }),
    })
    return { rpc, receipts: new ReceiptLogCache(rpc) }
  }

  function toLog(log: PrivacyRpcLog): Log {
    return {
      ...log,
      blockNumber: 100,
      blockHash: `0x${'cc'.repeat(32)}`,
      transactionHash: `0x${'bb'.repeat(32)}`,
      logIndex: 0,
    }
  }
})

describe(extractPrivacyAnonymitySetMember.name, () => {
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

    expect(extractPrivacyAnonymitySetMember(source, log)).toEqual({
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

    expect(() => extractPrivacyAnonymitySetMember(source, log)).toThrow(
      'Privacy Pools deposit is missing depositor',
    )
  })

  it('requests the transaction sender for Privacy Pools v2 deposits', () => {
    const iface = new utils.Interface([
      'event Deposited(uint256 outputCommitment, address indexed asset, uint256 depositedValue, address indexed caller)',
    ])
    const log = encodeLog(iface, 'Deposited', [1, TOKEN_ADDRESS, 500n, ADDRESS])
    expect(
      extractPrivacyAnonymitySetMember(
        {
          event: log.topics[0]!,
          extractor: 'privacyPoolsV2Value',
          params: { tokenAddress: TOKEN_ADDRESS },
        },
        log,
      ),
    ).toEqual({ amount: 500n, origin: { type: 'transaction' } })
  })

  it('requests the transaction sender for fixed deposits', () => {
    const source = {
      event: 'Deposit',
      extractor: 'fixedAmount',
      params: { amount: '100' },
    } satisfies PrivacyAnonymitySetDepositSource

    expect(
      extractPrivacyAnonymitySetMember(source, {
        address: ADDRESS.toString(),
        data: '0x',
        topics: [],
      }),
    ).toEqual({ amount: 100n, origin: { type: 'transaction' } })
  })

  it('drops zero-value deposits', () => {
    const source = {
      event: 'Deposited',
      extractor: 'privacyPoolsValue',
      params: {},
    } satisfies PrivacyAnonymitySetDepositSource
    const log = encodeLog(privacyPoolsInterface, 'Deposited', [
      EthereumAddress.random().toString(),
      1n,
      2n,
      0n,
      4n,
    ])

    expect(extractPrivacyAnonymitySetMember(source, log)).toEqual(undefined)
  })

  it('credits an Umbra key registration to its registrant with amount 0', () => {
    const source = {
      event: 'StealthKeyChanged',
      extractor: 'umbraStealthKeyChanged',
      params: {},
    } satisfies EvmPrivacyAnonymitySetSource
    const registrant = EthereumAddress.random()
    const log = encodeLog(umbraRegistryInterface, 'StealthKeyChanged', [
      registrant.toString(),
      2n,
      3n,
      2n,
      5n,
    ])

    expect(extractPrivacyAnonymitySetMember(source, log)).toEqual({
      amount: 0n,
      origin: { type: 'event', sender: registrant },
    })
  })

  it('parses the event that Umbra key registrations are configured with', async () => {
    const umbra = await new ProjectService().getProject({
      slug: 'umbra',
      select: ['privacyInfo'],
    })
    const anonymitySet = umbra?.privacyInfo.anonymitySet
    if (anonymitySet?.type !== 'key-registrations') {
      throw new Error('Umbra should track key registrations')
    }

    expect(anonymitySet.event).toEqual(
      umbraRegistryInterface.getEventTopic('StealthKeyChanged'),
    )
  })
})
