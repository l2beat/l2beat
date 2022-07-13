import {
  AddressAnalyzer,
  AnalyzedAddress,
  EthereumAddress,
} from '@l2beat/common'
import { constants, Contract, providers } from 'ethers'

import { bytes32ToAddress } from '../common/address'
import { getEip1967Admin, getEip1967Implementation } from '../common/eip1967'

export type ProxyAnalysis = EIP1967Analysis | GnosisSafeAnalysis

export interface EIP1967Analysis {
  type: 'eip1967'
  eip1967Admin: string
  eip1967Implementation: string
  implementationAnalysis: AnalyzedAddress
}

export interface GnosisSafeAnalysis {
  type: 'gnosis safe'
  implementationAnalysis: AnalyzedAddress
}

export async function analyzeProxy(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  proxyAddress: string,
): Promise<ProxyAnalysis | undefined> {
  const [implementation, admin, slot0, masterCopy] = await Promise.all([
    getEip1967Implementation(provider, proxyAddress),
    getEip1967Admin(provider, proxyAddress),
    getSlot0(provider, proxyAddress),
    getMasterCopy(provider, proxyAddress),
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

  if (implementation === constants.AddressZero) {
    return undefined
  }

  const implementationAnalysis = await addressAnalyzer.analyze(
    EthereumAddress(implementation),
  )
  return {
    type: 'eip1967',
    eip1967Admin: admin,
    eip1967Implementation: implementation,
    implementationAnalysis,
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
