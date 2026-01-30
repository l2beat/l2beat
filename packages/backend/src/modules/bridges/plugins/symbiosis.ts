/* 
Symbiosis Bridge. Sends message event on SRC. On DST MPC is authorised
to call a function on a target Portal contract. No event is emitted on DST.
Messages are sent to Symbiosis chain. On the DST they are received from
destination chain. Here we consider SRC->Symbiosis->DST as one message.
*/

import exp from 'constants'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  defineNetworks,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

/* 
event OracleRequest(address bridge, bytes callData, address receiveSide, address oppositeBridge, uint256 chainId)
event SynthesizeRequest(bytes32 id, address indexed from, uint256 indexed chainID, address indexed revertableAddress, address to, uint256 amount, address token)
event BurnCompleted(bytes32 indexed id, bytes32 indexed crossChainID, address indexed to, uint256 amount, uint256 bridgingFee, address token)
*/

//https://api.symbiosis.finance/crosschain/docs/#/Chains/get_v1_chains
export const SYMBIOSIS_NETWORKS = defineNetworks('symbiosis', [
  { symbiosisChainId: 1, chain: 'ethereum' },
  { symbiosisChainId: 13863860, chain: 'symbiosis' },
  { symbiosisChainId: 8453, chain: 'base' },
  { symbiosisChainId: 42161, chain: 'arbitrum' },
])

const parseOracleRequest = createEventParser(
  'event OracleRequest(address bridge, bytes callData, address receiveSide, address oppositeBridge, uint256 chainId)',
)

const parseSynthesizeRequest = createEventParser(
  'event SynthesizeRequest(bytes32 id, address indexed from, uint256 indexed chainID, address indexed revertableAddress, address to, uint256 amount, address token)',
)

const parseBurnCompleted = createEventParser(
  'event BurnCompleted(bytes32 indexed id, bytes32 indexed crossChainID, address indexed to, uint256 amount, uint256 bridgingFee, address token)',
)

export const OracleRequest = createBridgeEventType<{
  bridge: `0x${string}`
  callData: `0x${string}`
  receiveSide: `0x${string}`
  oppositeBridge: `0x${string}`
  chainId: bigint
}>('symbiosis.OracleRequest')

export const DispatchId = createBridgeEventType<{
  messageId: `0x${string}`
}>('hyperlane.DispatchId')

export const ProcessId = createBridgeEventType<{
  messageId: `0x${string}`
}>('hyperlane.ProcessId')

export class SymbiosisPlugIn implements BridgePlugin {
  name = 'symbiosis'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    // OracleRequest is emitted on SRC chain
  }

  match(delivery: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (ProcessId.checkType(delivery)) {
      const dispatchId = db.find(DispatchId, {
        messageId: delivery.args.messageId,
      })
      if (!dispatchId) {
        return
      }

      return [Result.Message('symbiosis.Message', [dispatchId, delivery])]
    }
  }
}
