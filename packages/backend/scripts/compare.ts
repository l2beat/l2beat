import chalk from 'chalk'
import { providers } from 'ethers'

export function compare<T>(name: string, expected: T, actual: T) {
  if (expected === actual) {
    console.log(chalk.greenBright(`  ✓ ${name}`))
  } else {
    console.log(chalk.redBright(`  ✗ ${name}`), actual)
  }
}

export async function compareResult<T>(
  name: string,
  expected: T,
  actual: Promise<T>,
) {
  try {
    compare(name, expected, await actual)
  } catch {
    console.log(chalk.redBright(`  ✗ ${name}`), 'ERROR')
  }
}

export function createCompare<T>(
  name: string,
  fn: (provider: providers.Provider, address: string) => Promise<T>,
) {
  return async function (
    provider: providers.Provider,
    address: string,
    expected: T,
  ) {
    await compareResult(name, expected, fn(provider, address))
  }
}
