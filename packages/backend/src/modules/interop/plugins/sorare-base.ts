import { Address32, ChainSpecificAddress } from '@l2beat/shared-pure'
import { PortalDepositFinalized, TransactionDeposited } from './opstack/opstack'
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
} from './types'

// == Event signatures ==

const transferRegisteredLog =
  'event TransferRegistered(bytes32 ticketHash, address indexed sender, address recipient, uint256 amount, bytes32 messageHash)'
const factRegisteredLog = 'event FactRegistered(bytes32 ticketHash)'

const L1_SORARE_BRIDGE = ChainSpecificAddress(
  'eth:0xDAB785F7719108390A26ff8d167e40aE4789F8D7',
)
const L2_SORARE_BRIDGE = ChainSpecificAddress(
  'base:0xba78a06459a85b6d01a613294fe91cf9ce8326cb',
)

const TransferRegistered = createInteropEventType<{
  ticketHash: string
  amount: bigint
}>('sorare-base.TransferRegistered')

const FactRegistered = createInteropEventType<{
  ticketHash: string
}>('sorare-base.FactRegistered')

const parseTransferRegistered = createEventParser(transferRegisteredLog)
const parseFactRegistered = createEventParser(factRegisteredLog)

export class SorareBasePlugin implements InteropPluginResyncable {
  readonly name = 'sorare-base'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: transferRegisteredLog,
        addresses: [L1_SORARE_BRIDGE],
      },
      {
        type: 'event',
        signature: factRegisteredLog,
        addresses: [L2_SORARE_BRIDGE],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const transferRegistered = parseTransferRegistered(input.log, [
        ChainSpecificAddress.address(L1_SORARE_BRIDGE),
      ])
      if (transferRegistered) {
        return [
          TransferRegistered.create(input, {
            ticketHash: transferRegistered.ticketHash,
            amount: transferRegistered.amount,
          }),
        ]
      }
    } else if (input.chain === 'base') {
      const factRegistered = parseFactRegistered(input.log, [
        ChainSpecificAddress.address(L2_SORARE_BRIDGE),
      ])
      if (factRegistered) {
        return [
          FactRegistered.create(input, {
            ticketHash: factRegistered.ticketHash,
          }),
        ]
      }
    }
  }

  matchTypes = [FactRegistered]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (FactRegistered.checkType(event)) {
      const portalDepositFinalized = db.find(PortalDepositFinalized, {
        ctx: { txHash: event.ctx.txHash },
        chain: 'base',
      })
      if (!portalDepositFinalized) return

      const transactionDeposited = db.find(TransactionDeposited, {
        sourceHash: portalDepositFinalized.args.sourceHash,
        chain: 'base',
      })
      if (!transactionDeposited) return

      const transferRegistered = db.find(TransferRegistered, {
        sameTxAtOffset: { event: transactionDeposited, offset: 3 },
      })
      if (!transferRegistered) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'sorare',
          srcEvent: transactionDeposited,
          dstEvent: portalDepositFinalized,
          extraEvents: [transferRegistered, event],
        }),
        Result.Transfer('sorare-base.L1ToL2Transfer', {
          srcEvent: transferRegistered,
          srcAmount: transferRegistered.args.amount,
          srcTokenAddress: Address32.NATIVE,
          srcWasBurned: false,
          dstEvent: event,
          dstAmount: transferRegistered.args.amount,
          dstTokenAddress: Address32.NATIVE,
          dstWasMinted: true,
        }),
      ]
    }
  }
}
