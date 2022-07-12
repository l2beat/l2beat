import {
  AddressAnalyzer,
  AnalyzedAddress,
  EthereumAddress,
} from '@l2beat/common'
import { providers, utils } from 'ethers'

import { analyzeProxy } from './analyzeProxy'
import { DiscoveryOptions } from './DiscoveryOptions'
import { getParameters, Parameter } from './getParameters'

export interface AnalyzedData {
  address: string
  analysis: AnalyzedAddress
  parameters: Parameter[]
}

export async function analyzeItem(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  address: string,
  options: DiscoveryOptions,
): Promise<{ analyzed: AnalyzedData; relatives: string[] }> {
  const [analysis, proxy] = await Promise.all([
    addressAnalyzer.analyze(EthereumAddress(address)),
    analyzeProxy(provider, addressAnalyzer, address),
  ])

  const abi = getAbi(proxy?.implementationAnalysis) ?? getAbi(analysis) ?? []
  const parameters = await getParameters(abi, address, provider, options)

  const relatives = parameters
    .flatMap((x) =>
      Array.isArray(x.value) ? (x.value as unknown[]) : [x.value],
    )
    .filter((x): x is string => typeof x === 'string' && utils.isAddress(x))

  if (proxy) {
    if (proxy.type === 'eip1967') {
      relatives.push(proxy.eip1967Admin)
      parameters.unshift(
        { name: 'eip1967Implementation', value: proxy.eip1967Implementation },
        { name: 'eip1967Admin', value: proxy.eip1967Admin },
      )
    }
  }

  const finalAnalysis = proxy?.implementationAnalysis ?? analysis

  return {
    analyzed: {
      address,
      analysis: finalAnalysis,
      parameters,
    },
    relatives,
  }
}

function getAbi(analysis?: AnalyzedAddress) {
  if (analysis?.type === 'Contract' && analysis.verified) {
    return analysis.abi
  }
}
