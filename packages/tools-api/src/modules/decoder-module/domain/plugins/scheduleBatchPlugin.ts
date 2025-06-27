import { toFunctionSelector } from 'viem'
import { addressSwitchChain } from '../../../../config/address'
import type { Address, Chain, TokenConfig } from '../../../../config/types'
import type { DecodedCall, Value } from '../DecodedResult'
import { toResultValue } from '../decode'
import { type AbiValue, decodeType } from '../encoding'
import type { NestedCall } from './types'

const selectors = {
  scheduleBatch: toFunctionSelector(
    'function scheduleBatch(address[] targets, uint256[] values, bytes[] payloads, bytes32 predecessor, bytes32 salt, uint256 delay)',
  ),
}

const RETRYABLE_TICKET_MAGIC: Address =
  'eth:0xa723c008e76e379c55599d2e4d93879beafda79c'

// Inboxes are contracts on Ethereum used to send messages to
// L2 to execute transactions there. We can't easily
// read them from discovery and we need to keep historical
// ones for ever, so we hardcode them here.
const L2Inboxes: Record<string, string> = {
  'eth:0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f': 'arb1',
  'eth:0xc4448b71118c9071bcb9734a0eac55d18a153949': 'arb-nova',
}

export function scheduleBatchPlugin(
  call: DecodedCall,
  chain: Chain,
  _to: Address | undefined,
  _tokens: TokenConfig,
  chains: Chain[],
): NestedCall[] | false {
  if (call.selector !== selectors.scheduleBatch) {
    return false
  }
  const targets = call.arguments[0]
  const payloads = call.arguments[2]
  if (
    targets?.decoded?.type !== 'array' ||
    payloads?.decoded?.type !== 'array'
  ) {
    return false
  }

  const calls: NestedCall[] = []
  for (const [i, item] of payloads.decoded.values.entries()) {
    if (item.decoded?.type !== 'bytes') {
      return false
    }

    const target = targets.decoded.values[i]
    if (
      target?.decoded?.type !== 'address' ||
      target.decoded.value !== RETRYABLE_TICKET_MAGIC
    ) {
      continue
    }

    const parsed = decodePayload(item, chain)
    if (parsed) {
      payloads.decoded.values[i] = parsed
      if (parsed.decoded?.type === 'array') {
        const inbox = parsed.decoded.values[0]?.decoded
        if (inbox?.type !== 'address') {
          return false
        }
        const destinationShortChainName = L2Inboxes[inbox.value]
        if (destinationShortChainName === undefined) {
          return false
        }
        const destinationChain = chains.find(
          (x) => x.shortName === destinationShortChainName,
        )
        if (destinationChain === undefined) {
          return false
        }

        let to: Address | undefined
        if (parsed.decoded.values[1]?.decoded?.type === 'address') {
          to = parsed.decoded.values[1]?.decoded.value
          if (to !== undefined) {
            to = addressSwitchChain(to, destinationChain)
            parsed.decoded.values[1].decoded.value = to
          }
        }
        if (parsed.decoded.values[5]) {
          calls.push({ to, data: parsed.decoded.values[5] })
        }
      }
    }
  }
  return calls
}

function decodePayload(item: Value, chain: Chain): Value | undefined {
  if (item.decoded?.type !== 'bytes') {
    return undefined
  }
  let decoded: AbiValue
  try {
    decoded = decodeType(
      // TODO: change chains on addresses?
      '(address targetInbox, address l2Target, uint256 l2Value, uint256 gasLimit, uint256 maxFeePerGas, bytes l2Calldata)',
      item.decoded.value,
    )
  } catch {
    return undefined
  }
  return toResultValue(decoded, chain)
}
