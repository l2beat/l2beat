import type {
  CallParameters,
  IRpcClient,
  MulticallV3Response,
} from '@l2beat/shared'
import { Bytes } from '@l2beat/shared-pure'

export async function callWithOptionalMulticall(
  rpc: Pick<IRpcClient, 'call' | 'isMulticallDeployed' | 'multicall'>,
  calls: CallParameters[],
  blockNumber: number,
): Promise<MulticallV3Response[]> {
  if (rpc.isMulticallDeployed(blockNumber)) {
    return await rpc.multicall(calls, blockNumber)
  }

  const results: MulticallV3Response[] = []
  for (const call of calls) {
    try {
      const data = await rpc.call(call, blockNumber)
      results.push({ success: true, data })
    } catch (error) {
      if (!isCallRevertedError(error)) {
        throw error
      }
      results.push({ success: false, data: Bytes.EMPTY })
    }
  }
  return results
}

function isCallRevertedError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  const message = error.message.toLowerCase()
  return message.includes('revert') || message.includes('call_exception')
}
