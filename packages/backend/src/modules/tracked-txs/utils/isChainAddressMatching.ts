import type { TrackedTxSharedBridgeConfig } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

export function isChainAddressMatching(
  input: string,
  sharedBridgeConfig: TrackedTxSharedBridgeConfig,
) {
  const functionFragment = sharedBridgeConfig.signature.replace('function ', '')
  const i = new utils.Interface([sharedBridgeConfig.signature])
  const decodedInput = i.decodeFunctionData(functionFragment, input)
  const chainAddress = EthereumAddress(decodedInput[0] as string)

  return chainAddress === sharedBridgeConfig.chainAddress
}
