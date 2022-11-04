import { providers } from 'ethers'

import { L1_ERC20_Bridge, L1_ERC20_Bridge__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'

export async function getHopBridgeParams(
  provider: providers.JsonRpcProvider,
  address: string,
  label: string,
): Promise<ContractParameters> {
  const hopBridge: L1_ERC20_Bridge = L1_ERC20_Bridge__factory.connect(
    address,
    provider,
  )

  return {
    name: label,
    address: address,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      challenge_amount_divisor: (
        await hopBridge.CHALLENGE_AMOUNT_DIVISOR()
      ).toString(),
      time_slot_size: (await hopBridge.TIME_SLOT_SIZE()).toString(),
      challengePeriod: (await hopBridge.challengePeriod()).toString(),
      challengeResolutionPeriod: (
        await hopBridge.challengeResolutionPeriod()
      ).toString(),
      chainId: (await hopBridge.getChainId()).toString(),
      governance: await hopBridge.governance(),
      minTransferRootBondDelay: (
        await hopBridge.minTransferRootBondDelay()
      ).toString(),
    },
  }
}
