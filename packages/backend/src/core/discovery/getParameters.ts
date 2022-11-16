import { Bytes, EthereumAddress } from '@l2beat/types'
import { BigNumber, utils } from 'ethers'

import { DiscoveryOptions } from './DiscoveryOptions'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { ContractValue } from './types'
import { readArray } from './utils/array'
import { isRevert } from './utils/isRevert'

export interface Parameter {
  name: string
  value: ContractValue
}

export async function getParameters(
  abiEntries: string[],
  address: EthereumAddress,
  provider: DiscoveryProvider,
  options: DiscoveryOptions,
): Promise<Parameter[]> {
  const abi = new utils.Interface(abiEntries)
  const functions = Object.entries(abi.functions)
    .map((x) => x[1])
    .filter((x) => x.stateMutability === 'view' || x.constant)
    .filter(
      (x) =>
        !(options.skipMethods[address.toString()] ?? []).some(
          (y) => y === x.name,
        ),
    )
  const simpleFunctions = functions.filter((x) => x.inputs.length === 0)
  const arrayFunctions = functions.filter(
    (x) => x.inputs.length === 1 && x.inputs[0].type === 'uint256',
  )

  const values = await Promise.all([
    ...simpleFunctions.map((x) =>
      getRegularParameter(address, abi, x, provider),
    ),
    ...arrayFunctions.map((x) => getArrayParameter(address, abi, x, provider)),
  ])
  return values.filter((x): x is Parameter => x !== undefined)
}

async function getRegularParameter(
  address: EthereumAddress,
  abi: utils.Interface,
  method: utils.FunctionFragment,
  provider: DiscoveryProvider,
): Promise<Parameter | undefined> {
  try {
    const callData = Bytes.fromHex(abi.encodeFunctionData(method, []))
    const result = await provider.call(address, callData)
    console.log(`Called ${address.toString()}.${method.name}()`)
    const decoded = abi.decodeFunctionResult(method, result.toString())
    const mapped = decoded.map(toContractValue)
    return {
      name: method.name,
      value: mapped.length === 1 ? mapped[0] : mapped,
    }
  } catch (e) {
    if (isRevert(e)) {
      return undefined
    }
    console.error(`Failed to call ${address.toString()}.${method.name}()`)
    throw e
  }
}

async function getArrayParameter(
  address: EthereumAddress,
  abi: utils.Interface,
  method: utils.FunctionFragment,
  provider: DiscoveryProvider,
): Promise<Parameter> {
  const results = await readArray(async (i) => {
    const callData = Bytes.fromHex(abi.encodeFunctionData(method, [i]))
    const result = await provider.call(address, callData)
    console.log(`Called ${address.toString()}.${method.name}(${i})`)
    const decoded = abi.decodeFunctionResult(method, result.toString())
    const mapped = decoded.map(toContractValue)
    return mapped.length === 1 ? mapped[0] : mapped
  })
  return {
    name: method.name,
    value: toContractValue(results),
  }
}

export function toContractValue(value: unknown): ContractValue {
  if (Array.isArray(value)) {
    return value.map(toContractValue)
  }
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
