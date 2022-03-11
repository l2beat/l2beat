import { AddressAnalyzer } from '@l2beat/common'
import chalk from 'chalk'
import { BigNumber, constants, providers, utils } from 'ethers'

import { analyzeItem2 } from './analyzeItem'
import { Config } from './config'

export async function walkConfig(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  config: Config,
  libAddressManager: string,
  startingPoints: string[]
) {
  const resolved = new Map<string, Record<string, unknown>>()

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
    const { analyzed, relatives }= await analyzeItem2(
      provider,
      addressAnalyzer,
      libAddressManager,
      config,
      componentName
    )

    console.log('Resolved', componentName, 'to', analyzed.componentAddress)
    resolved.set(componentName, analyzed)
    stack.push(...relatives)
  }

  prettyPrint2(resolved)
}


function prettyPrint2(resolved: Map<string, Record<string, unknown>>) {
  console.log(resolved)
}

function prettyPrint(resolved: Map<string, Record<string, unknown>>) {
  const addressMap = new Map<string, string>()
  for (const [address, analyzed] of resolved) {
    if (typeof analyzed.name === 'string') {
      addressMap.set(address, analyzed.name)
    }
  }

  for (const [address, analyzed] of resolved) {
    if (analyzed.type === 'EOA') {
      continue
    }
    console.log(chalk.blue(address))
    for (const [key, value] of Object.entries(analyzed)) {
      prettyPrintValue(key, value, addressMap)
    }
  }
}

function prettyPrintValue(
  key: string,
  value: unknown,
  addressMap: Map<string, string>,
  indent = 1
) {
  const spaces = ' '.repeat(indent * 4 - 1)
  if (Array.isArray(value)) {
    console.log(spaces, key)
    for (const [i, v] of value.entries()) {
      prettyPrintValue(i.toString(), v, addressMap, indent + 1)
    }
  } else if (BigNumber.isBigNumber(value)) {
    console.log(spaces, key, chalk.yellow('' + value))
  } else if (typeof value === 'string' && utils.isAddress(value)) {
    const name = addressMap.get(value)
    if (name) {
      if (!name.startsWith('<')) {
        console.log(spaces, key, chalk.magenta(name), chalk.green(value))
      } else {
        console.log(spaces, key, chalk.cyan(name), chalk.cyan(value))
      }
    } else {
      console.log(spaces, key, chalk.green(value))
    }
  } else {
    console.log(spaces, key, chalk.red('' + value))
  }
}
