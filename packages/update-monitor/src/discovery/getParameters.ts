import { BigNumber, Contract, providers, utils } from 'ethers'

import { readArray } from '../common/array'
import { isRevert } from '../common/isRevert'
import { ContractValue } from '../types'
import { DiscoveryOptions } from './DiscoveryOptions'
import { JsonFragment } from './getAbi'

export interface Parameter {
  name: string
  value: ContractValue
}

export async function getParameters(
  abiJson: JsonFragment[],
  address: string,
  provider: providers.Provider,
  options: DiscoveryOptions,
): Promise<Parameter[]> {
  const abi = new utils.Interface(abiJson)
  const functions = Object.entries(abi.functions)
    .map((x) => x[1])
    .filter((x) => x.stateMutability === 'view' || x.constant)
    .filter(
      (x) => !(options.skipMethods[address] ?? []).some((y) => y === x.name),
    )
  const simpleFunctions = functions.filter((x) => x.inputs.length === 0)
  const arrayFunctions = functions.filter(
    (x) => x.inputs.length === 1 && x.inputs[0].type === 'uint256',
  )

  const values = await Promise.all([
    ...simpleFunctions.map((x) => getRegularParameter(address, x, provider)),
    ...arrayFunctions.map((x) => getArrayParameter(address, x, provider)),
  ])
  return values.filter((x): x is Parameter => x !== undefined)
}

async function getRegularParameter(
  address: string,
  method: utils.FunctionFragment,
  provider: providers.Provider,
): Promise<Parameter | undefined> {
  const contract = new Contract(address, [method], provider)
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const result: unknown = await contract[method.name]()
    console.log(`Called ${address}.${method.name}()`)
    return {
      name: method.name,
      value: toContractValue(result),
    }
  } catch (e) {
    if (isRevert(e)) {
      return undefined
    }
    console.error(`Failed to call ${address}.${method.name}()`)
    throw e
  }
}

async function getArrayParameter(
  address: string,
  method: utils.FunctionFragment,
  provider: providers.Provider,
): Promise<Parameter> {
  const contract = new Contract(address, [method], provider)
  const results = await readArray((i) =>
    // eslint-disable-next-line
    contract[method.name](i).then((x: unknown) => {
      console.log(`Called ${address}.${method.name}(${i})`)
      return x
    }),
  )
  return {
    name: method.name,
    value: toContractValue(results),
  }
}

function toContractValue(value: unknown): ContractValue {
  if (Array.isArray(value)) {
    return value.map(toSimpleContractValue)
  }
  return toSimpleContractValue(value)
}

function toSimpleContractValue(value: unknown): string | number | boolean {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }
  if (BigNumber.isBigNumber(value)) {
    if (value.gt(Number.MAX_SAFE_INTEGER.toString())) {
      return value.toString()
    } else {
      return value.toNumber()
    }
  }
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return `${value}`
}
