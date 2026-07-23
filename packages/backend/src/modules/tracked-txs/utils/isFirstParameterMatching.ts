import type { TrackedTxSharedBridgeConfig } from '@l2beat/shared'
import { decodeFunctionCallInput } from './decodeFunctionCallInput'

/** This function checks if the first parameter of the input matches the first parameter of the shared bridge config. */
export function isFistParameterMatching(
  input: string,
  sharedBridgeConfig: TrackedTxSharedBridgeConfig,
) {
  const decodedInput = decodeFunctionCallInput(
    sharedBridgeConfig.signature,
    input,
  )
  const firstParameter = String(decodedInput[0])

  return firstParameter === sharedBridgeConfig.firstParameter.toString()
}
