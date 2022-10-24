import { providers } from 'ethers'

import { bytes32ToAddress } from '../../../common/address'
import { getMembers } from '../../../common/utils/getMembers'
import { LiquidityNetwork } from '../../../typechain/cBridge/LiquidityNetwork'
import { LiquidityNetwork__factory } from '../../../typechain/factories/cBridge/LiquidityNetwork__factory'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

const DEPLOYED_AT = 13719989

export async function getLiquidityNetwork(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const cbridge = LiquidityNetwork__factory.connect(
    addresses.liquidityNetwork,
    provider,
  )

  const delayPeriod = (await cbridge.delayPeriod()).toString()
  const epochLength = (await cbridge.epochLength()).toString()
  const minimalMaxSlippage = (await cbridge.minimalMaxSlippage()).toString()
  const nativeWrap = (await cbridge.nativeWrap()).toString()
  const noticePeriod = (await cbridge.noticePeriod()).toString()
  const owner = (await cbridge.owner()).toString()
  const paused = (await cbridge.paused()).toString()
  const resetTime = (await cbridge.resetTime()).toString()
  const ssHash = (await cbridge.ssHash()).toString()
  const triggerTime = (await cbridge.triggerTime()).toString()

  const pausers = await getPausers(provider, cbridge)
  const governors = await getGovernors(provider, cbridge)

  return {
    name: 'LiquidityNetwork',
    address: addresses.liquidityNetwork,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      delayPeriod,
      epochLength,
      minimalMaxSlippage,
      nativeWrap,
      noticePeriod,
      owner,
      paused,
      resetTime, //changed when signers are reset
      ssHash, //updated when signers are updated
      triggerTime, //updated when signers are updated
      pausers,
      governors,
    },
  }
}

async function getPausers(
  provider: providers.JsonRpcProvider,
  cbridge: LiquidityNetwork,
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
  cbridge: LiquidityNetwork,
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
