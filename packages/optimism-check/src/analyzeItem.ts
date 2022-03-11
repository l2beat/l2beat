import { AddressAnalyzer, AnalyzedAddress, EthereumAddress } from '@l2beat/common'
import { Contract, providers, utils } from 'ethers'

import { Config, ContractDescription } from './config'



/* 
Analyze Item. Get all item information and the list of "relatives", that is
the next set of items to be analysed 
*/
export async function analyzeItem(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  libAddressManager: string,
  config: Config,
  component: string
): Promise<{ analyzed: Record<string, unknown>;relatives: string[]}> {
  
  const libAbi = [
    "function getAddress(string) view returns (address)"
  ]

  const libAddressContract = new Contract(libAddressManager, libAbi, provider)
  const componentAddress = await libAddressContract.getAddress(component)
  const componentContract = await addressAnalyzer.analyze(componentAddress)
  var libAddressManager = ''
  var owner = ''
  var parameters:any[] = []

  if (componentContract.type === 'Contract' && componentContract.verified) {
    const addMgrAbi = [
      "function libAddressManager() view returns (address)",
      "function owner() view returns (string)"
    ]
    const libAddressContract = new Contract(componentAddress, addMgrAbi, provider)
    libAddressManager = await libAddressContract.libAddressManager()
    if (config[component].parameters) {
      parameters = await getParameters(config[component], componentAddress, provider)
    }
    //owner = await libAddressContract.owner()
    //console.log(libAddressManager, owner)
  }

  const relatives:string[] = config[component].dependencies ?? []

  return {
    analyzed:{
      componentAddress, 
      libAddressManager,
      componentContract,
      ...Object.fromEntries(parameters.map((x) => [x.name, x.value])),
    }, 
    relatives
  }
}


async function getParameters(
  description: ContractDescription,
  address: string,
  provider: providers.Provider
): Promise<{ name: string; value: unknown }[]> {
  return await Promise.all(
      description.parameters?.map(async (entry) => {
        if (entry.type === 'constant') {
          return {name: entry.name, value: entry.value}
        } else {
          return getRegularParameter(address, entry.abi, provider)
        }
      })
    ?? [])
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
