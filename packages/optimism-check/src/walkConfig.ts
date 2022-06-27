import { AddressAnalyzer } from '@l2beat/common'
import chalk from 'chalk'
import Table from 'easy-table'
import { BigNumber, constants, providers } from 'ethers'

import { AnalyzedItem, analyzeItem } from './analyzeItem'
import { AnalyzedMainBridge, analyzeMainBridge } from './analyzeMainBridge'
import { Contracts, MainBridgeConfig } from './config'

export async function walkConfig(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  contracts: Contracts,
  libAddressManager: string,
  startingPoints: string[],
  mainBridge: MainBridgeConfig,
  network: string,
) {
  const bridgeConfig: AnalyzedMainBridge = await analyzeMainBridge(
    provider,
    addressAnalyzer,
    mainBridge,
  )
  prettyBridgePrint(bridgeConfig, network)

  const resolved = new Map<string, AnalyzedItem>()
  const stack = [...startingPoints]
  while (stack.length !== 0) {
    const componentName = stack.pop()
    if (
      !componentName ||
      componentName === constants.AddressZero ||
      resolved.has(componentName)
    ) {
      continue
    }
    const { analyzed, relatives } = await analyzeItem(
      provider,
      addressAnalyzer,
      libAddressManager,
      contracts,
      componentName,
    )

    //console.log('Resolved', componentName, 'to', analyzed.componentAddress)
    resolved.set(componentName, analyzed)
    stack.push(...relatives)
  }

  prettyPrint(resolved, network)
}

function prettyBridgePrint(bridge: AnalyzedMainBridge, network: string) {
  console.log()
  console.log('Main Bridge of', network)
  console.log()
  console.log('Bridge Proxy Contract: ', bridge.proxy.name)
  console.log('Brige Proxy Owner:', bridge.owner)
  if (!(bridge.implementation as { verified: boolean }).verified) {
    console.log(chalk.red('Warning: Bridge implementation is not verified !'))
  }
  console.log(
    'Bridge Implementation Contract: ',
    bridge.implementationAddress,
    bridge.implementation.name,
  )
  console.log('Messenger:', bridge.messengerAddress, bridge.messenger.name)
  console.log(
    '   Lib_ResolvedDelegateProxy libaddressManager:',
    bridge.libResolvedDelegateProxyAddressManager,
  )
  console.log(
    '   Lib_ResolvedDelegateProxy implementationName:',
    bridge.libResolvedDelegateProxyImplementationName,
  )
  console.log()
}

function prettyPrint(resolved: Map<string, AnalyzedItem>, network: string) {
  //console.debug(resolved)
  const t = new Table()
  const t2 = new Table()
  const t3 = new Table()
  for (const [componentName, analyzed] of resolved) {
    const addressType = analyzed.componentContract.type
    let contractName = ''
    if (addressType === 'Contract') {
      if (analyzed.componentContract.verified) {
        contractName = analyzed.componentContract.name
      } else {
        contractName = chalk.red('Not verified !')
      }
    }
    t.cell('Name', componentName)
    t.cell('Address', analyzed.componentAddress)
    t.cell('Type', analyzed.componentContract.type)
    t.cell('ContractName', contractName)
    t.newRow()

    if (addressType === 'Contract') {
      t2.cell('Name', componentName)
      t2.cell('LibAddressManager', analyzed.libAddressManager)
      t2.newRow()

      for (const [key, value] of Object.entries(analyzed)) {
        if (
          key != 'componentAddress' &&
          key != 'libAddressManager' &&
          key != 'componentContract'
        ) {
          t3.cell('Component', componentName)
          t3.cell('Parameter', key)
          t3.cell('Value', prettifyValue(value))
          t3.newRow()
        }
      }
    }
  }
  console.log()
  console.log('Components of', network)
  console.log()
  console.log(t.toString())

  console.log()
  console.log('LibAddressManager of', network)
  console.log()
  console.log(t2.toString())

  console.log()
  console.log('Parameters of', network)
  console.log()
  console.log(t3.toString())
}

function prettifyValue(value: unknown) {
  if (BigNumber.isBigNumber(value)) {
    return chalk.yellow(value)
  } else if (typeof value === 'string') {
    return chalk.blue(value)
  } else {
    return value
  }
}
