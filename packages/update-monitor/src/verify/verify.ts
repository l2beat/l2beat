import chalk from 'chalk'
import _ from 'lodash'

import { ProjectParameters } from '../types'

export function verify(
  parameters: ProjectParameters,
  rules: [string, string][],
) {
  for (const [left, right] of rules) {
    const leftValue = getValue(parameters, left)
    const rightValue = getValue(parameters, right)
    if (leftValue !== rightValue) {
      console.warn(
        chalk.bgRed(' ERROR '),
        chalk.red(`Verification mismatch in ${parameters.name}!`),
      )
      const [leftSelector, rightSelector] = alignLeft(left, right)
      const [leftResult, rightResult] = alignRight(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${leftValue}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${rightValue}`,
      )
      console.warn(`  ${leftSelector} ${chalk.red(leftResult)}`)
      console.warn(`  ${rightSelector} ${chalk.red(rightResult)}`)
    }
  }
}

function alignLeft(a: string, b: string): [string, string] {
  return [
    a.length < b.length ? a.padEnd(b.length, ' ') : a,
    b.length < a.length ? b.padEnd(a.length, ' ') : b,
  ]
}

function alignRight(a: string, b: string): [string, string] {
  return [
    a.length < b.length ? a.padStart(b.length, ' ') : a,
    b.length < a.length ? b.padStart(a.length, ' ') : b,
  ]
}

function getValue(parameters: ProjectParameters, selector: string) {
  const [contractName, ...path] = selector
    .split(/\.|\[|\]/)
    .filter((x) => x !== '')
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (contractName === undefined) {
    throw new Error(`Invalid selector ${JSON.stringify(selector)}`)
  }
  const contract = parameters.contracts.find((x) => x.name === contractName)
  if (contract === undefined) {
    throw new Error(`Cannot find ${contractName} in ${parameters.name}`)
  }
  if (path.length === 0) {
    return contract.address
  }
  if (path[0] !== 'upgradeability') {
    path.unshift('values')
  }
  const value: unknown = _.get(contract, path)
  if (value === undefined) {
    throw new Error(
      `Cannot find ${JSON.stringify(selector)} in ${parameters.name}`,
    )
  }
  return value
}
