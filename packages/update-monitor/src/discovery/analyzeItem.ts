import { AddressAnalyzer } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { providers, utils } from 'ethers'

import { ContractParameters, UpgradeabilityParameters } from '../types'
import { analyzeProxy } from './analyzeProxy'
import { DiscoveryOptions } from './DiscoveryOptions'
import { getAbi, JsonFragment } from './getAbi'
import { getParameters } from './getParameters'

export interface AnalyzedData extends ContractParameters {
  meta: {
    isEOA: boolean
    verified: boolean
    implementationVerified: boolean
    abi: JsonFragment[]
  }
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

  const abi = getAbi(
    options.addAbis[address],
    proxy?.implementationAnalysis,
    analysis,
  )

  const parameters = await getParameters(abi, address, provider, options)

  const relatives = parameters
    .flatMap((x) =>
      Array.isArray(x.value) ? (x.value as unknown[]) : [x.value],
    )
    .filter((x): x is string => typeof x === 'string' && utils.isAddress(x))

  if (proxy) {
    if (proxy.type === 'eip1967') {
      parameters.unshift({ name: 'eip1967Admin', value: proxy.eip1967Admin })
    }
  }

  let upgradeability: UpgradeabilityParameters = { type: 'immutable' }
  if (proxy?.type === 'eip1967') {
    relatives.push(proxy.eip1967Admin)
    parameters.unshift({ name: 'eip1967Admin', value: proxy.eip1967Admin })
    upgradeability = {
      type: 'proxy',
      implementation: proxy.eip1967Implementation,
    }
  } else if (proxy?.type === 'starkWare2019') {
    upgradeability = {
      type: 'proxy',
      implementation: proxy.starkWare2019Implementation,
    }
  } else if (proxy?.type === 'gnosis safe') {
    upgradeability = { type: 'gnosis safe' }
  } else if (proxy?.type === 'eip897') {
    upgradeability = {
      type: 'proxy',
      implementation: proxy.eip897Implementation,
    }
  }

  return {
    analyzed: {
      name: proxy?.implementationAnalysis.name ?? analysis.name,
      address,
      upgradeability,
      values: Object.fromEntries(parameters.map((x) => [x.name, x.value])),
      meta: {
        isEOA: analysis.type === 'EOA',
        verified: analysis.type === 'Contract' ? analysis.verified : true,
        implementationVerified:
          proxy?.implementationAnalysis.type === 'Contract'
            ? proxy.implementationAnalysis.verified
            : true,
        abi,
      },
    },
    relatives,
  }
}
