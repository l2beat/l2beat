import { AddressAnalyzer, EthereumAddress } from '@l2beat/common'
import { Contract, providers, utils } from 'ethers'

import { analyzeEip1967Proxy } from './analyzeEip1967Proxy'
import { Config, ContractDescription } from './config'

export async function analyzeItem(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  config: Config,
  address: string,
): Promise<{ analyzed: Record<string, unknown>; relatives: string[] }> {
  const [analysis, proxy] = await Promise.all([
    addressAnalyzer.analyze(EthereumAddress(address)),
    analyzeEip1967Proxy(provider, addressAnalyzer, address),
  ])

  const name = proxy?.name ?? analysis.name
  const description = analysis.type === 'EOA' ? undefined : config[name]
  const parameters = description
    ? await getParameters(description, address, provider)
    : []
  const relatives = parameters
    .flatMap((x) =>
      Array.isArray(x.value) ? (x.value as unknown[]) : [x.value],
    )
    .filter((x): x is string => typeof x === 'string' && utils.isAddress(x))

  if (proxy) {
    relatives.push(proxy.eip1967Admin)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  delete (analysis as any).abi

  return {
    analyzed: {
      address: address,
      ...analysis,
      ...proxy,
      ...Object.fromEntries(parameters.map((x) => [x.name, x.value])),
    },
    relatives,
  }
}

async function getParameters(
  description: ContractDescription,
  address: string,
  provider: providers.Provider,
): Promise<{ name: string; value: unknown }[]> {
  return await Promise.all(
    description.abi.map(async (entry) => {
      if (typeof entry === 'string') {
        return getRegularParameter(address, entry, provider)
      } else {
        return getArrayParameter(address, entry.method, provider)
      }
    }),
  )
}

async function getRegularParameter(
  address: string,
  method: string,
  provider: providers.Provider,
) {
  const contract = new Contract(address, [method], provider)
  const methodName = Object.values(contract.interface.functions)[0].name
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const result: unknown = await contract[methodName]()
  return {
    name: methodName,
    value: result,
  }
}

async function getArrayParameter(
  address: string,
  method: string,
  provider: providers.Provider,
) {
  const contract = new Contract(address, [method], provider)
  const methodName = Object.values(contract.interface.functions)[0].name
  const results: unknown[] = []
  for (let i = 0; ; i++) {
    // eslint-disable-next-line
    const result: unknown = await contract[methodName](i).catch(() => undefined)
    if (result !== undefined) {
      results.push(result)
    } else {
      break
    }
  }
  return {
    name: methodName,
    value: results,
  }
}
