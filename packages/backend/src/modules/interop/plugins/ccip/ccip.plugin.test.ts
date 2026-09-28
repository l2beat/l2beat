import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  type AbiEvent,
  encodeAbiParameters,
  encodeEventTopics,
  type Log,
  parseAbiItem,
} from 'viem'
import { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import type { LogToCapture } from '../types'
import { CCIPConfig, type CCIPNetwork } from './ccip.config'
import {
  CCIPPlugin,
  CCIPSendRequested,
  ExecutionStateChanged,
} from './ccip.plugin'

const ETHEREUM_SELECTOR = 5009297550715157269n
const ARBITRUM_SELECTOR = 4949039107694359620n

const ON_RAMP = address('1')
const CURRENT_OFF_RAMP = address('2')
const RETIRED_OFF_RAMP = address('3')
const RETIRED_LANE_OFF_RAMP = address('4')
const TOKEN_A = address('a')
const TOKEN_B = address('b')
const POOL = address('c')

const lockedOrBurned = parseAbiItem(
  'event LockedOrBurned(uint64 indexed remoteChainSelector, address token, address sender, uint256 amount)',
)
const ccipMessageSent = parseAbiItem(
  'event CCIPMessageSent(uint64 indexed destChainSelector, uint64 indexed sequenceNumber, ((bytes32 messageId, uint64 sourceChainSelector, uint64 destChainSelector, uint64 sequenceNumber, uint64 nonce) header, address sender, bytes data, bytes receiver, bytes extraArgs, address feeToken, uint256 feeTokenAmount, uint256 feeValueJuels, (address sourcePoolAddress, bytes destTokenAddress, bytes extraData, uint256 amount, bytes destGasAmount)[] tokenAmounts) message)',
)
const executionStateChangedV16 = parseAbiItem(
  'event ExecutionStateChanged(uint64 indexed sourceChainSelector, uint64 indexed sequenceNumber, bytes32 indexed messageId, bytes32 messageHash, uint8 state, bytes returnData, uint256 gasUsed)',
)
const executionStateChangedV15 = parseAbiItem(
  'event ExecutionStateChanged(uint64 indexed sequenceNumber, bytes32 indexed messageId, uint8 state, bytes returnData)',
)

describe(CCIPPlugin.name, () => {
  describe(CCIPPlugin.prototype.getDataRequests.name, () => {
    it('requests deliveries from every known OffRamp, not just the documented one', async () => {
      const plugin = await createPlugin()

      const addresses = plugin
        .getDataRequests()
        .flatMap((request) =>
          request.type === 'event' &&
          request.signature.includes('ExecutionStateChanged') &&
          request.addresses !== '*'
            ? request.addresses
            : [],
        )

      for (const offRamp of [
        CURRENT_OFF_RAMP,
        RETIRED_OFF_RAMP,
        RETIRED_LANE_OFF_RAMP,
      ]) {
        expect(addresses.map((a) => a.toString())).toInclude(`eth:${offRamp}`)
      }
    })
  })

  describe(CCIPPlugin.prototype.capture.name, () => {
    it('captures v1.6 deliveries from an OffRamp dropped from the docs', async () => {
      const plugin = await createPlugin()
      const log = makeLog(
        executionStateChangedV16,
        {
          sourceChainSelector: ARBITRUM_SELECTOR,
          sequenceNumber: 1n,
          messageId: bytes32('1'),
          messageHash: bytes32('2'),
          state: 2,
          returnData: '0x',
          gasUsed: 0n,
        },
        RETIRED_OFF_RAMP,
        0,
      )

      const events = plugin.capture(capture(log, [log])) ?? []

      expect(events.map((event) => event.args)).toEqual([
        ExecutionStateChanged.mock({
          messageId: bytes32('1'),
          state: 2,
          $srcChain: 'arbitrum',
          dstTokens: undefined,
        }).args,
      ])
    })

    it('resolves the source chain of a v1.5 delivery through a retired per-lane OffRamp', async () => {
      const plugin = await createPlugin()
      const log = makeLog(
        executionStateChangedV15,
        {
          sequenceNumber: 1n,
          messageId: bytes32('3'),
          state: 2,
          returnData: '0x',
        },
        RETIRED_LANE_OFF_RAMP,
        0,
      )

      const events = plugin.capture(capture(log, [log])) ?? []

      expect(
        events.map((event) => (event.args as { $srcChain: string }).$srcChain),
      ).toEqual(['base'])
    })

    it('attributes each send in a multi-message transaction only its own tokens', async () => {
      const plugin = await createPlugin()
      const txLogs = [
        makeLockedOrBurned(TOKEN_A, 100n, 0),
        makeMessageSent(bytes32('a'), 100n, 1),
        makeLockedOrBurned(TOKEN_B, 200n, 2),
        makeMessageSent(bytes32('b'), 200n, 3),
      ]

      const [first, second] = [txLogs[1], txLogs[3]].map(
        (log) => plugin.capture(capture(log, txLogs))?.[0],
      )

      expect(first?.args).toEqual(
        CCIPSendRequested.mock({
          messageId: bytes32('a'),
          token: Address32.from(TOKEN_A),
          amount: 100n,
          index: 0,
          $dstChain: 'arbitrum',
          wasBurned: false,
          isCctpBacked: undefined,
        }).args,
      )
      expect(second?.args).toEqual(
        CCIPSendRequested.mock({
          messageId: bytes32('b'),
          token: Address32.from(TOKEN_B),
          amount: 200n,
          index: 0,
          $dstChain: 'arbitrum',
          wasBurned: false,
          isCctpBacked: undefined,
        }).args,
      )
    })
  })
})

async function createPlugin() {
  const network: CCIPNetwork = {
    chain: 'ethereum',
    chainSelector: ETHEREUM_SELECTOR.toString(),
    outboundLanes: {},
    inboundLanes: {},
    onRamp: ON_RAMP,
    offRamp: CURRENT_OFF_RAMP,
    offRampsBySource: { base: [RETIRED_LANE_OFF_RAMP] },
    offRamps: [RETIRED_OFF_RAMP],
  }
  const store = new InteropConfigStore(undefined)
  await store.set(CCIPConfig, {
    networks: [network],
    chainSelectorToName: {
      [ETHEREUM_SELECTOR.toString()]: 'ethereum',
      [ARBITRUM_SELECTOR.toString()]: 'arbitrum',
    },
  })
  return new CCIPPlugin(store)
}

function makeLockedOrBurned(
  token: EthereumAddress,
  amount: bigint,
  logIndex: number,
) {
  return makeLog(
    lockedOrBurned,
    {
      remoteChainSelector: ARBITRUM_SELECTOR,
      token,
      sender: ON_RAMP,
      amount,
    },
    POOL,
    logIndex,
  )
}

function makeMessageSent(
  messageId: `0x${string}`,
  amount: bigint,
  logIndex: number,
) {
  return makeLog(
    ccipMessageSent,
    {
      destChainSelector: ARBITRUM_SELECTOR,
      sequenceNumber: BigInt(logIndex),
      message: {
        header: {
          messageId,
          sourceChainSelector: ETHEREUM_SELECTOR,
          destChainSelector: ARBITRUM_SELECTOR,
          sequenceNumber: BigInt(logIndex),
          nonce: 0n,
        },
        sender: address('d'),
        data: '0x',
        receiver: '0x',
        extraArgs: '0x',
        feeToken: address('e'),
        feeTokenAmount: 0n,
        feeValueJuels: 0n,
        tokenAmounts: [
          {
            sourcePoolAddress: POOL,
            destTokenAddress: '0x',
            extraData: '0x',
            amount,
            destGasAmount: '0x',
          },
        ],
      },
    },
    ON_RAMP,
    logIndex,
  )
}

function makeLog(
  event: AbiEvent,
  args: Record<string, unknown>,
  logAddress: EthereumAddress,
  logIndex: number,
): Log {
  const topics = encodeEventTopics({
    abi: [event],
    eventName: event.name,
    args,
  } as Parameters<typeof encodeEventTopics>[0])
  const dataInputs = event.inputs.filter((input) => !input.indexed)
  const data = encodeAbiParameters(
    dataInputs,
    dataInputs.map((input) => args[input.name ?? '']),
  )
  return {
    address: logAddress.toLowerCase() as `0x${string}`,
    topics: topics as Log['topics'],
    data,
    logIndex,
    blockNumber: 1n,
    blockHash: bytes32('f'),
    transactionHash: bytes32('0'),
    transactionIndex: 0,
    removed: false,
  }
}

function capture(log: Log, txLogs: Log[]): LogToCapture {
  return {
    log,
    txLogs,
    tx: { hash: bytes32('0') },
    block: { number: 1, timestamp: 1 },
    chain: 'ethereum',
  } as unknown as LogToCapture
}

function address(digit: string) {
  return EthereumAddress(`0x${digit.repeat(40)}`)
}

function bytes32(digit: string): `0x${string}` {
  return `0x${digit.repeat(64)}`
}
