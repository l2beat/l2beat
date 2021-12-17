import { Contract, providers, utils } from 'ethers'

import { analyzeEip1967Proxy } from './analyzeEip1967Proxy'
import { analyzeEOA } from './analyzeEOA'
import { Config, ContractDescription } from './config'
import { EtherscanApi } from './EtherscanApi'

export async function analyzeItem(
  provider: providers.Provider,
  etherscanApi: EtherscanApi,
  config: Config,
  address: string
): Promise<{ analyzed: Record<string, unknown>; relatives: string[] }> {
  const [eoa, baseName, proxy] = await Promise.all([
    analyzeEOA(provider, address),
    etherscanApi.getContractName(address),
    analyzeEip1967Proxy(provider, etherscanApi, address),
  ])

  const name = proxy?.name ?? baseName
  const description = eoa.EOA ? undefined : config[name]
  const parameters = description
    ? await getParameters(description, address, provider)
    : []
  const relatives = parameters
    .flatMap((x) => (Array.isArray(x.value) ? x.value : [x.value]))
    .filter((x): x is string => typeof x === 'string' && utils.isAddress(x))

  if (proxy) {
    relatives.push(proxy.eip1967Admin)
  }

  return {
    analyzed: {
      address: address,
      ...(eoa.EOA ? {} : { name }),
      ...eoa,
      ...proxy,
      ...Object.fromEntries(parameters.map((x) => [x.name, x.value])),
    },
    relatives,
  }
}

async function getParameters(
  description: ContractDescription,
  address: string,
  provider: providers.Provider
): Promise<{ name: string; value: unknown }[]> {
  return await Promise.all(
    description.abi.map(async (entry) => {
      if (typeof entry === 'string') {
        return getRegularParameter(address, entry, provider)
      } else {
        return getArrayParameter(address, entry.method, provider)
      }
    })
  )
}

async function getRegularParameter(
  address: string,
  method: string,
  provider: providers.Provider
) {
  const contract = new Contract(address, [method], provider)
  const methodName = Object.values(contract.interface.functions)[0].name
  const result = await contract[methodName]()
  return {
    name: methodName,
    value: result,
  }
}

async function getArrayParameter(
  address: string,
  method: string,
  provider: providers.Provider
) {
  const contract = new Contract(address, [method], provider)
  const methodName = Object.values(contract.interface.functions)[0].name
  const results: unknown[] = []
  for (let i = 0; ; i++) {
    const result = await contract[methodName](i).catch(() => undefined)
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
