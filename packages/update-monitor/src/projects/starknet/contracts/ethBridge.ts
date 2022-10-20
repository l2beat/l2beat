import { providers } from 'ethers'

import { StarkWareProxy } from '../../../common/proxies/StarkWareProxy'
import { getStarkWareNamedStorageAddress } from '../../../common/starkWareNamedStorage'
import { EthBridge__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getEthBridge(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const ethBridge = EthBridge__factory.connect(addresses.ethBridge, provider)

  return {
    name: 'EthBridge',
    address: ethBridge.address,
    upgradeability: await StarkWareProxy.getUpgradeability(provider, ethBridge),
    values: {
      upgradeActivationDelay: (
        await ethBridge.getUpgradeActivationDelay()
      ).toNumber(),
      maxDeposit: (await ethBridge.maxDeposit()).toString(),
      maxTotalBalance: (await ethBridge.maxTotalBalance()).toString(),
      bridgedToken: await getStarkWareNamedStorageAddress(
        provider,
        ethBridge,
        'STARKNET_ERC20_TOKEN_BRIDGE_TOKEN_ADDRESS',
      ),
      l2TokenContract: await getStarkWareNamedStorageAddress(
        provider,
        ethBridge,
        'STARKNET_TOKEN_BRIDGE_L2_TOKEN_CONTRACT',
      ),
      messagingContract: await getStarkWareNamedStorageAddress(
        provider,
        ethBridge,
        'STARKNET_TOKEN_BRIDGE_MESSAGING_CONTRACT',
      ),
      depositorAddress: await getStarkWareNamedStorageAddress(
        provider,
        ethBridge,
        'STARKNET_TOKEN_BRIDGE_DEPOSITOR_ADDRESSES',
      ),
    },
  }
}
