import chalk from 'chalk'
import { BigNumber, constants, providers, utils } from 'ethers'

import { analyzeItem } from './analyzeItem'
import { Config } from './config'
import { EtherscanApi } from './EtherscanApi'

export async function walkConfig(
  provider: providers.Provider,
  etherscanApi: EtherscanApi,
  config: Config,
  startingPoints: string[]
) {
  const resolved = new Map<string, Record<string, unknown>>()

  const stack = [...startingPoints]
  while (stack.length !== 0) {
    const address = stack.pop()
    if (
      !address ||
      address === constants.AddressZero ||
      resolved.has(address)
    ) {
      continue
    }
    const { analyzed, relatives } = await analyzeItem(
      provider,
      etherscanApi,
      config,
      address
    )
    console.log('Analyzed', address)
    resolved.set(address, analyzed)
    stack.push(...relatives)
  }

  prettyPrint(resolved)
}

function prettyPrint(resolved: Map<string, Record<string, unknown>>) {
  const addressMap = new Map<string, string>()
  for (const [address, analyzed] of resolved) {
    if (typeof analyzed.name === 'string') {
      addressMap.set(address, analyzed.name)
    } else if (analyzed.EOA) {
      addressMap.set(address, 'EOA')
    } else {
      addressMap.set(address, '???')
    }
  }

  for (const [address, analyzed] of resolved) {
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
      if (name !== 'EOA') {
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
