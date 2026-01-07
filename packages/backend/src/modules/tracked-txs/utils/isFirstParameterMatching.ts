import type { TrackedTxSharedBridgeConfig } from '@l2beat/shared'
import { utils } from 'ethers'

/** This function checks if the first parameter of the input matches the first parameter of the shared bridge config. */
export function isFistParameterMatching(
  input: string,
  sharedBridgeConfig: TrackedTxSharedBridgeConfig,
) {
  const functionFragment = sharedBridgeConfig.signature.replace('function ', '')
  const i = new utils.Interface([sharedBridgeConfig.signature])
  const decodedInput = i.decodeFunctionData(functionFragment, input)
  const firstParameter = String(decodedInput[0])

  return firstParameter === sharedBridgeConfig.firstParameter.toString()
}
