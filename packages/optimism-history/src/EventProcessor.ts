import { AddressAnalyzer } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { Event, providers, utils } from 'ethers'

import { BlockTimestampService } from './BlockTimestampService'
import { OptimismNameService } from './OptimismNameService'

export class EventProcessor {
  constructor(
    private provider: providers.Provider,
    private blockTimestampService: BlockTimestampService,
    private optimismNameService: OptimismNameService,
    private addressAnalyzer: AddressAnalyzer,
  ) {}

  async processEvent(event: Event) {
    const nameHash = (event.args?.name as { hash: string }).hash
    const newAddress = EthereumAddress(event.args?.newAddress as string)
    const [timestamp, name, implementationName] = await Promise.all([
      this.blockTimestampService.getBlockTimestamp(event.blockNumber),
      this.optimismNameService.getOptimismName(nameHash, event.transactionHash),
      this.addressAnalyzer.getName(newAddress),
    ])
    let fullImplName = implementationName
    if (implementationName === 'L1ChugSplashProxy') {
      const implName = await this.analyzeChugSplashProxy(newAddress.toString())
      fullImplName = implementationName + ' (impl: ' + implName + ')'
    }
    return {
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      nameHash,
      oldAddress: event.args?.oldAddress as string,
      newAddress,
      timestamp,
      name,
      implementationName: fullImplName,
    }
  }

  async analyzeChugSplashProxy(proxyAddress: string) {
    const IMPLEMENTATION_SLOT =
      '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
    // const ADMIN_SLOT =
    //   '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'
    const implementationSlot = await this.provider.getStorageAt(
      proxyAddress,
      IMPLEMENTATION_SLOT,
    )
    const implementation = this.wordToAddress(implementationSlot)
    return this.addressAnalyzer.getName(EthereumAddress(implementation))
  }

  wordToAddress(word: string) {
    return utils.getAddress('0x' + word.slice(26))
  }
}

/*
const IMPLEMENTATION_SLOT = slot('eip1967.proxy.implementation')
const ADMIN_SLOT = slot('eip1967.proxy.admin')

export async function analyzeEip1967Proxy(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  proxyAddress: string
) {
  const [implementationSlot, adminSlot] = await Promise.all([
    provider.getStorageAt(proxyAddress, IMPLEMENTATION_SLOT),
    provider.getStorageAt(proxyAddress, ADMIN_SLOT),
  ])
  if (implementationSlot === '0x' + '0'.repeat(64)) {
    return undefined
  }
  const implementation = wordToAddress(implementationSlot)
  const admin = wordToAddress(adminSlot)
  const { name } = await addressAnalyzer.analyze(
    EthereumAddress(implementation)
  )
  return {
    name,
    eip1967Implementation: implementation,
    eip1967Admin: admin,
  }
}

function wordToAddress(word: string) {
  return utils.getAddress('0x' + word.substr(26, 40))
}

function slot(name: string) {
  const hash = utils.solidityKeccak256(['string'], [name])
  return '0x' + (BigInt(hash) - 1n).toString(16).padStart(64, '0')
}
*/
