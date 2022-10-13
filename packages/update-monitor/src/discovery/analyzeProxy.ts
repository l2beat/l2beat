import { AddressAnalyzer, AnalyzedAddress } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { constants, Contract, providers } from 'ethers'

import { bytes32ToAddress } from '../common/address'
import { getEip897Implementation } from '../common/eip897'
import { getEip1967Admin, getEip1967Implementation } from '../common/eip1967'
import { getStarkWare2019Implementation } from '../common/starkWareProxy'

export type ProxyAnalysis =
  | EIP1967Analysis
  | StarkWare2019Analysis
  | GnosisSafeAnalysis
  | EIP897Analysis

export interface EIP1967Analysis {
  type: 'eip1967'
  eip1967Admin: string
  eip1967Implementation: string
  implementationAnalysis: AnalyzedAddress
}

export interface StarkWare2019Analysis {
  type: 'starkWare2019'
  starkWare2019Implementation: string
  implementationAnalysis: AnalyzedAddress
}

export interface GnosisSafeAnalysis {
  type: 'gnosis safe'
  implementationAnalysis: AnalyzedAddress
}

export interface EIP897Analysis {
  type: 'eip897'
  eip897Implementation: string
  implementationAnalysis: AnalyzedAddress
}

export async function analyzeProxy(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  proxyAddress: string,
): Promise<ProxyAnalysis | undefined> {
  const [
    eip1967Implementation,
    eip1967Admin,
    starkWare2019Implementation,
    slot0,
    masterCopy,
    eip897Implementation,
  ] = await Promise.all([
    getEip1967Implementation(provider, proxyAddress),
    getEip1967Admin(provider, proxyAddress),
    getStarkWare2019Implementation(provider, proxyAddress),
    getSlot0(provider, proxyAddress),
    getMasterCopy(provider, proxyAddress),
    getEip897Implementation(provider, proxyAddress),
  ])

  if (masterCopy && masterCopy === slot0) {
    const implementationAnalysis = await addressAnalyzer.analyze(
      EthereumAddress(masterCopy),
    )
    return {
      type: 'gnosis safe',
      implementationAnalysis,
    }
  }

  if (starkWare2019Implementation !== constants.AddressZero) {
    const implementationAnalysis = await addressAnalyzer.analyze(
      EthereumAddress(starkWare2019Implementation),
    )
    return {
      type: 'starkWare2019',
      starkWare2019Implementation,
      implementationAnalysis,
    }
  }

  if (eip1967Implementation !== constants.AddressZero) {
    const implementationAnalysis = await addressAnalyzer.analyze(
      EthereumAddress(eip1967Implementation),
    )
    return {
      type: 'eip1967',
      eip1967Admin: eip1967Admin,
      eip1967Implementation,
      implementationAnalysis,
    }
  }

  if (eip897Implementation !== constants.AddressZero) {
    const implementationAnalysis = await addressAnalyzer.analyze(
      EthereumAddress(eip897Implementation),
    )
    return {
      type: 'eip897',
      eip897Implementation,
      implementationAnalysis,
    }
  }
}

async function getSlot0(provider: providers.Provider, address: string) {
  const value = await provider.getStorageAt(address, 0)
  return bytes32ToAddress(value)
}

async function getMasterCopy(provider: providers.Provider, address: string) {
  const contract = new Contract(
    address,
    ['function masterCopy() view returns(address)'],
    provider,
  )
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return (await contract.masterCopy()) as string
  } catch {
    return undefined
  }
}
