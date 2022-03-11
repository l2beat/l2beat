import { AddressAnalyzer, AnalyzedAddress } from '@l2beat/common'
import chalk from 'chalk'

import { BigNumber, constants, providers, utils } from 'ethers'

import { analyzeItem, AnalyzedItem } from './analyzeItem'
import { Contracts } from './config'

import Table from 'easy-table'

export async function walkConfig(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  contracts: Contracts,
  libAddressManager: string,
  startingPoints: string[],
  network: string
) {
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
      componentName
    )

    console.log('Resolved', componentName, 'to', analyzed.componentAddress)
    resolved.set(componentName, analyzed)
    stack.push(...relatives)
  }

  prettyPrint(resolved, network)
}

function prettyPrint(resolved: Map<string, AnalyzedItem>, network: string) {
  //console.debug(resolved)
  var t = new Table()
  var t2 = new Table()
  var t3 = new Table()
  for (const [componentName, analyzed] of resolved) {
    const addressType = analyzed.componentContract.type
    var contractName = ''
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
