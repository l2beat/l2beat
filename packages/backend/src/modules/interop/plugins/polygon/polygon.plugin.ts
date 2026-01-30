import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import { findParsedAround } from '../hyperlane-hwr'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from '../types'
import { PolygonConfig } from './polygon.config'

const STATE_SENDER = EthereumAddress(
  '0x28e4F3a7f651294B9564800b2D01f35189A5bFbE',
)
const STATE_RECEIVER = EthereumAddress(
  '0x0000000000000000000000000000000000001001',
)
const DEPOSIT_MANAGER = EthereumAddress(
  '0x401F6c983eA34274ec46f84D70b31C151321188b',
)
const ETHER_PREDICATE = EthereumAddress(
  '0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30',
)
const ETHER_FAKE_ADDRESS = EthereumAddress(
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
)

const stateSyncedLog =
  'event StateSynced(uint256 indexed id, address indexed contractAddress, bytes data)'
const stateCommittedLog =
  'event StateCommitted(uint256 indexed stateId, bool success)'
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'
const withdrawLog =
  'event Withdraw(address indexed token, address indexed from, uint256 amount, uint256 input1, uint256 output1)'
const lockedEtherLog =
  'event LockedEther(address indexed depositor, address indexed depositReceiver, uint256 amount)'
const exitedEtherLog =
  'event ExitedEther(address indexed exitor, uint256 amount)'

const parseStateSynced = createEventParser(stateSyncedLog)
const parseStateCommitted = createEventParser(stateCommittedLog)
const parseTransfer = createEventParser(transferLog)
const parseWithdraw = createEventParser(withdrawLog)
const parseLockedEther = createEventParser(lockedEtherLog)
const parseExitedEther = createEventParser(exitedEtherLog)

const L1StateSynced = createInteropEventType<{
  stateId: bigint
  srcTokenAddress?: Address32
  srcAmount?: bigint
}>('polygon.StateSynced', {
  direction: 'outgoing',
  ttl: 30 * UnixTime.DAY,
})

const L2StateCommitted = createInteropEventType<{
  stateId: bigint
  success: boolean
}>('polygon.StateCommitted', { direction: 'incoming' })

const L2WithdrawalInitiated = createInteropEventType<{
  matchId: string
  rootToken: Address32
  childToken?: Address32
  recipient: EthereumAddress
  amount: bigint
}>('polygon.WithdrawalInitiated', {
  direction: 'outgoing',
  ttl: 30 * UnixTime.DAY,
})

const L1WithdrawalFinalized = createInteropEventType<{
  matchId: string
  rootToken: Address32
  recipient: EthereumAddress
  amount: bigint
}>('polygon.WithdrawalFinalized', { direction: 'incoming' })

function polygonWithdrawMatchId(
  rootToken: Address32,
  recipient: EthereumAddress,
  amount: bigint,
): string {
  return `${rootToken}-${recipient}-${amount}`
}

function parseTransferAmount(log: LogToCapture['txLogs'][number]) {
  const transfer = parseTransfer(log, null)
  if (!transfer) return

  return {
    amount: transfer.value,
    from: EthereumAddress(transfer.from),
    to: EthereumAddress(transfer.to),
  }
}

function findClosestTransfer(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
) {
  return findParsedAround(logs, startLogIndex, (log) => {
    const transfer = parseTransferAmount(log)
    if (!transfer) return

    return {
      tokenAddress: Address32.from(log.address),
      amount: transfer.amount,
      from: transfer.from,
      to: transfer.to,
    }
  })
}

export class PolygonPlugin implements InteropPluginResyncable {
  readonly name = 'polygon'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const config = this.configs.get(PolygonConfig)
    if (!config) {
      return []
    }

    const rootTokens = config.rootTokens ?? []
    const childTokens = config.childTokens ?? []

    return [
      {
        type: 'event',
        signature: stateSyncedLog,
        includeTxEvents: [transferLog, lockedEtherLog],
        addresses: [ChainSpecificAddress.fromLong('ethereum', STATE_SENDER)],
      },
      {
        type: 'event',
        signature: stateCommittedLog,
        addresses: [
          ChainSpecificAddress.fromLong('polygonpos', STATE_RECEIVER),
        ],
      },
      {
        type: 'event',
        signature: transferLog,
        addresses: rootTokens.map((address) =>
          ChainSpecificAddress.fromLong(
            'ethereum',
            Address32.cropToEthereumAddress(address),
          ),
        ),
      },
      {
        type: 'event',
        signature: transferLog,
        addresses: childTokens.map((address) =>
          ChainSpecificAddress.fromLong(
            'polygonpos',
            Address32.cropToEthereumAddress(address),
          ),
        ),
      },
      {
        type: 'event',
        signature: withdrawLog,
        addresses: childTokens.map((address) =>
          ChainSpecificAddress.fromLong(
            'polygonpos',
            Address32.cropToEthereumAddress(address),
          ),
        ),
      },
      {
        type: 'event',
        signature: exitedEtherLog,
        addresses: [ChainSpecificAddress.fromLong('ethereum', ETHER_PREDICATE)],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const exitedEther = parseExitedEther(input.log, [ETHER_PREDICATE])
      if (exitedEther) {
        return [
          L1WithdrawalFinalized.create(input, {
            matchId: polygonWithdrawMatchId(
              Address32.from(ETHER_FAKE_ADDRESS),
              EthereumAddress(exitedEther.exitor),
              exitedEther.amount,
            ),
            rootToken: Address32.NATIVE,
            recipient: EthereumAddress(exitedEther.exitor),
            amount: exitedEther.amount,
          }),
        ]
      }

      const stateSynced = parseStateSynced(input.log, [STATE_SENDER])
      if (stateSynced) {
        let srcTokenAddress: Address32 | undefined
        let srcAmount: bigint | undefined

        const lockedEtherData = findParsedAround(
          input.txLogs,
          input.log.logIndex ?? -1,
          (log) => {
            const lockedEther = parseLockedEther(log, [ETHER_PREDICATE])
            if (!lockedEther) return

            return {
              tokenAddress: Address32.NATIVE,
              amount: lockedEther.amount,
            }
          },
        )

        if (lockedEtherData) {
          srcTokenAddress = lockedEtherData.tokenAddress
          srcAmount = lockedEtherData.amount
        } else {
          const transfer = findClosestTransfer(
            input.txLogs,
            input.log.logIndex ?? -1,
          )
          srcTokenAddress = transfer?.tokenAddress
          srcAmount = transfer?.amount
        }

        return [
          L1StateSynced.create(input, {
            stateId: stateSynced.id,
            srcTokenAddress,
            srcAmount,
          }),
        ]
      }

      const transfer = parseTransfer(input.log, null)
      if (transfer) {
        const config = this.configs.get(PolygonConfig)
        const from = EthereumAddress(transfer.from)
        const isFromPredicate = (config?.predicates ?? []).some(
          (predicate) => predicate === from,
        )

        if (from !== DEPOSIT_MANAGER && !isFromPredicate) {
          return
        }

        const recipient = EthereumAddress(transfer.to)
        const rootToken = Address32.from(input.log.address)
        const amount = transfer.value
        const matchId = polygonWithdrawMatchId(rootToken, recipient, amount)

        return [
          L1WithdrawalFinalized.create(input, {
            matchId,
            rootToken,
            recipient,
            amount,
          }),
        ]
      }

      return
    }

    if (input.chain !== 'polygonpos') return

    const stateCommitted = parseStateCommitted(input.log, [STATE_RECEIVER])
    if (stateCommitted) {
      if (!stateCommitted.success) return

      return [
        L2StateCommitted.create(input, {
          stateId: stateCommitted.stateId,
          success: stateCommitted.success,
        }),
      ]
    }

    const transfer = parseTransfer(input.log, null)
    if (transfer) {
      const transferData = parseTransferAmount(input.log)
      if (!transferData) return
      if (transferData.to !== EthereumAddress.ZERO) return

      const config = this.configs.get(PolygonConfig)
      const childToken = Address32.from(input.log.address)
      const rootToken = config?.childToRoot?.[childToken]
      if (!rootToken) return

      const recipient = transferData.from
      const amount = transferData.amount
      const matchId = polygonWithdrawMatchId(rootToken, recipient, amount)

      return [
        L2WithdrawalInitiated.create(input, {
          matchId,
          rootToken,
          childToken,
          recipient,
          amount,
        }),
      ]
    }

    const withdraw = parseWithdraw(input.log, null)
    if (withdraw) {
      const config = this.configs.get(PolygonConfig)
      const childToken = Address32.from(input.log.address)
      const rootToken = config?.childToRoot?.[childToken]
      if (!rootToken) return

      const recipient = EthereumAddress(withdraw.from)
      const amount = withdraw.amount
      const matchId = polygonWithdrawMatchId(rootToken, recipient, amount)

      return [
        L2WithdrawalInitiated.create(input, {
          matchId,
          rootToken,
          childToken,
          recipient,
          amount,
        }),
      ]
    }
  }

  matchTypes = [L2StateCommitted, L1WithdrawalFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (L2StateCommitted.checkType(event)) {
      const stateSynced = db.find(L1StateSynced, {
        stateId: event.args.stateId,
      })
      if (!stateSynced) return

      const config = this.configs.get(PolygonConfig)
      const srcTokenAddress = stateSynced.args.srcTokenAddress
      // polygon to l2b translation for ETH
      const srcTokenAddress_polygon =
        srcTokenAddress === Address32.NATIVE
          ? Address32.from(ETHER_FAKE_ADDRESS)
          : srcTokenAddress
      const dstTokenAddress = srcTokenAddress_polygon
        ? config?.rootToChild?.[srcTokenAddress_polygon]
        : undefined

      if (!dstTokenAddress) {
        return [
          Result.Message('polygon.Message', {
            app: 'unknown',
            srcEvent: stateSynced,
            dstEvent: event,
          }),
        ]
      }

      return [
        Result.Message('polygon.Message', {
          app: 'canonical-deposit',
          srcEvent: stateSynced,
          dstEvent: event,
        }),
        Result.Transfer('polygon.Transfer', {
          srcEvent: stateSynced,
          srcTokenAddress,
          srcAmount: stateSynced.args.srcAmount,
          srcWasBurned: false,
          dstEvent: event,
          dstTokenAddress,
          dstAmount: stateSynced.args.srcAmount,
          dstWasMinted: true,
        }),
      ]
    }

    if (L1WithdrawalFinalized.checkType(event)) {
      const withdrawal = db.find(L2WithdrawalInitiated, {
        matchId: event.args.matchId,
      })
      if (!withdrawal) return

      const config = this.configs.get(PolygonConfig)
      const srcTokenAddress =
        withdrawal.args.childToken ??
        config?.rootToChild?.[withdrawal.args.rootToken]

      return [
        Result.Message('polygon.Message', {
          app: 'canonical-withdrawal',
          srcEvent: withdrawal,
          dstEvent: event,
        }),
        Result.Transfer('polygon.Transfer', {
          srcEvent: withdrawal,
          srcTokenAddress,
          srcAmount: withdrawal.args.amount,
          srcWasBurned: true,
          dstEvent: event,
          dstTokenAddress: event.args.rootToken,
          dstAmount: event.args.amount,
          dstWasMinted: false,
        }),
      ]
    }
  }
}
