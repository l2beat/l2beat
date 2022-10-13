import { AddressAnalyzer, AnalyzedAddress } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { Contract, providers } from 'ethers'

import { ContractDescription, Contracts } from './config'

export interface AnalyzedItem {
  componentAddress: string
  libAddressManager: string
  componentContract: AnalyzedAddress
  [key: string]: unknown
}

/* 
Analyze Item. Get all item information and the list of "relatives", that is
the next set of items to be analysed 
*/
export async function analyzeItem(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  libAddressManager: string,
  contracts: Contracts,
  component: string,
): Promise<{ analyzed: AnalyzedItem; relatives: string[] }> {
  const libAbi = ['function getAddress(string) view returns (address)']

  const libAddressContract = new Contract(libAddressManager, libAbi, provider)
  const componentAddress = (await libAddressContract.functions.getAddress(
    component,
  )) as string

  if (contracts[component].expectedAddress) {
    if (componentAddress !== contracts[component].expectedAddress) {
      console.log(
        `Warning: ${component} resolved to a different address than expected !`,
      )
    }
  }
  const componentContract = await addressAnalyzer.analyze(
    EthereumAddress(componentAddress),
  )
  let parameters: { name: string; value: unknown }[] = []
  let libAddressManagerLocal = ''

  if (componentContract.type === 'Contract' && componentContract.verified) {
    const addMgrAbi = ['function libAddressManager() view returns (address)']
    const libAddressContract = new Contract(
      componentAddress,
      addMgrAbi,
      provider,
    )
    libAddressManagerLocal =
      (await libAddressContract.functions.libAddressManager()) as string
    if (contracts[component].parameters) {
      parameters = await getParameters(
        contracts[component],
        componentAddress,
        provider,
      )
    }
  }

  const relatives: string[] = contracts[component].dependencies ?? []

  return {
    analyzed: {
      componentAddress,
      libAddressManager: libAddressManagerLocal,
      componentContract: componentContract,
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
    description.parameters?.map(async (entry) => {
      if (entry.type === 'constant') {
        return { name: entry.name, value: entry.value }
      } else {
        return getRegularParameter(address, entry.abi, provider)
      }
    }) ?? [],
  )
}

async function getRegularParameter(
  address: string,
  method: string,
  provider: providers.Provider,
) {
  const contract = new Contract(address, [method], provider)
  const methodName = Object.values(contract.interface.functions)[0].name
  const result: unknown = await contract.functions[methodName]()
  return {
    name: methodName,
    value: result,
  }
}
