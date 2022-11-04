import { providers } from 'ethers'

import { bytes32ToAddress } from '../../../common/address'
import { getMembers } from '../../../common/utils/getMembers'
import { TokenBridge } from '../../../typechain/cBridge/TokenBridge'
import { TokenBridge__factory } from '../../../typechain/factories/cBridge/TokenBridge__factory'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

const DEPLOYED_AT = 13808358

export async function getTokenBridge(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const cbridge = TokenBridge__factory.connect(addresses.tokenBridge, provider)

  const delayPeriod = (await cbridge.delayPeriod()).toString()
  const epochLength = (await cbridge.epochLength()).toString()
  const owner = (await cbridge.owner()).toString()
  const paused = (await cbridge.paused()).toString()
  const sigsVerifier = await cbridge.sigsVerifier()

  const pausers = await getPausers(provider, cbridge)
  const governors = await getGovernors(provider, cbridge)

  return {
    name: 'TokenBridge',
    address: addresses.tokenBridge,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      delayPeriod,
      epochLength,
      owner,
      paused,
      sigsVerifier,
      pausers,
      governors,
    },
  }
}

async function getPausers(
  provider: providers.JsonRpcProvider,
  cbridge: TokenBridge,
) {
  const pausersAddedFilter = cbridge.filters.PauserAdded()
  const logsGranted = await provider.getLogs({
    ...pausersAddedFilter,
    fromBlock: DEPLOYED_AT,
  })
  const granted = logsGranted.map((l) => l.data)

  const pausersRemovedFilter = cbridge.filters.PauserRemoved()
  const logsRevoked = await provider.getLogs({
    ...pausersRemovedFilter,
    fromBlock: DEPLOYED_AT,
  })
  const revoked = logsRevoked.map((l) => l.data)

  const pausers = getMembers(granted, revoked)

  return pausers.map(bytes32ToAddress)
}

async function getGovernors(
  provider: providers.JsonRpcProvider,
  cbridge: TokenBridge,
) {
  const governorsAddedFilter = cbridge.filters.GovernorAdded()
  const logsGranted = await provider.getLogs({
    ...governorsAddedFilter,
    fromBlock: DEPLOYED_AT,
  })
  const granted = logsGranted.map((l) => l.data)

  const governorsRemovedFilter = cbridge.filters.GovernorRemoved()
  const logsRevoked = await provider.getLogs({
    ...governorsRemovedFilter,
    fromBlock: DEPLOYED_AT,
  })
  const revoked = logsRevoked.map((l) => l.data)

  const governors = getMembers(granted, revoked)

  return governors.map(bytes32ToAddress)
}
