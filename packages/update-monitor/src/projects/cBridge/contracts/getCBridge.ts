import { providers } from 'ethers'

import { CBridge__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getCBridge(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const cbridge = CBridge__factory.connect(addresses.cBridge, provider)

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

  return {
    name: 'CBRidge',
    address: addresses.cBridge,
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
      resetTime,
      ssHash, //updated when signers are updated
      triggerTime, //updated when signers are updated
    },
  }
}

//todo 
/*
  *epoch volume caps
  *epoch volumes
  governors
  pausers

*/