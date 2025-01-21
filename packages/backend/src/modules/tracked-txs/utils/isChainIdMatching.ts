import type { TrackedTxSharedBridgeConfig } from '@l2beat/shared'
import { utils } from 'ethers'

export function isChainIdMatching(
  input: string,
  sharedBridgeConfig: TrackedTxSharedBridgeConfig,
) {
  const functionFragment = sharedBridgeConfig.signature.replace('function ', '')
  const i = new utils.Interface([sharedBridgeConfig.signature])
  const decodedInput = i.decodeFunctionData(functionFragment, input)
  const chainId = Number(decodedInput[0] as bigint)

  return chainId === sharedBridgeConfig.chainId
}
