import { toFunctionSelector } from 'viem'
import type { Address, Chain, TokenConfig } from '../../../../config/types'
import type { DecodedCall } from '../DecodedResult'
import { sliceBytes } from '../encoding'
import { decodeTaikoActions, toActionsValue } from './taikoActions'
import type { NestedCall } from './types'

const selectors = {
  onMessageInvocation: toFunctionSelector(
    'function onMessageInvocation(bytes _data)',
  ),
}

const EXECUTION_ID_BYTES = 8

/**
 * Taiko DAO proposals reach L2 through the Taiko Bridge, which calls
 * `DelegateController.onMessageInvocation(bytes _data)`. The payload is not
 * a function call but a packed `bytes8(executionId) ++ abi.encode(Action[])`
 * (see `DelegateController.onMessageInvocation` and
 * `Controller._executeActions`). Without this plugin the generic decoder
 * treats the leading zero bytes of the execution id as a selector and leaves
 * the whole payload as opaque bytes.
 */
export function taikoDelegateControllerPlugin(
  call: DecodedCall,
  chain: Chain,
  _to: Address | undefined,
  _tokens: TokenConfig,
): NestedCall[] | false {
  if (call.selector !== selectors.onMessageInvocation) {
    return false
  }

  const payload = call.arguments[0]
  if (payload?.decoded?.type !== 'bytes') {
    return false
  }

  const data = payload.decoded.value
  if (data.length <= 2 + EXECUTION_ID_BYTES * 2) {
    return false
  }

  const executionId = sliceBytes(data, 0, EXECUTION_ID_BYTES)
  const encodedActions = sliceBytes(data, EXECUTION_ID_BYTES)

  const actions = decodeTaikoActions(encodedActions, chain)
  if (!actions) {
    // Other IMessageInvocable implementations (e.g. the vaults) use a
    // different payload format, fall back to the generic decoding.
    return false
  }

  payload.abi = `(uint64 executionId, ${actions.abi} actions)`
  payload.decoded = {
    type: 'array',
    values: [
      {
        name: 'executionId',
        abi: 'uint64',
        encoded: executionId,
        decoded: { type: 'number', value: BigInt(executionId).toString() },
      },
      toActionsValue('actions', encodedActions, actions),
    ],
  }

  return actions.calls
}
