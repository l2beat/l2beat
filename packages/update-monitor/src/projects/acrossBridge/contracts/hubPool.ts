import { constants, providers } from 'ethers'

import { HubPool__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getHubPool(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const contract = HubPool__factory.connect(addresses.hubPool, provider)

  return {
    name: 'HubPool',
    address: addresses.hubPool,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      bondToken: await contract.bondToken(),
      finder: await contract.finder(),
      lpTokenFactory: await contract.lpTokenFactory(),
      owner: await contract.owner(),
      paused: await contract.paused(),
      protocolFeeCaptureAddress: await contract.protocolFeeCaptureAddress(),
      protocolFeeCapturePct: (
        await contract.protocolFeeCapturePct()
      ).toNumber(),
      timerAddress: await contract.timerAddress(),
      weth: await contract.weth(),
      crossChainContracts: (
        await Promise.all(
          // https://docs.across.to/v/developer-docs/developers/contract-addresses
          // https://github.com/across-protocol/relayer-v2/blob/519e54ee2d635a17899eeba37a7029803da95f18/src/common/Constants.ts#L8
          [1, 10, 137, 288, 42161].map(async (i) => {
            const res = await contract.crossChainContracts(i)
            return [res.adapter, res.spokePool]
          }),
        )
      )
        .flat()
        .filter((a) => a !== constants.AddressZero),
    },
  }
}
