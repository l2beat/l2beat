import { json } from '@l2beat/common'
import { Contract, providers, utils } from 'ethers'

import { DiscoveryOptions } from './DiscoveryOptions'

export interface Parameter {
  name: string
  value: unknown
}

export async function getParameters(
  abiJson: json,
  address: string,
  provider: providers.Provider,
  options: DiscoveryOptions,
): Promise<Parameter[]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  const abi = new utils.Interface(abiJson as any)
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

  return await Promise.all([
    ...simpleFunctions.map((x) => getRegularParameter(address, x, provider)),
    ...arrayFunctions.map((x) => getArrayParameter(address, x, provider)),
  ])
}

async function getRegularParameter(
  address: string,
  method: utils.FunctionFragment,
  provider: providers.Provider,
): Promise<Parameter> {
  const contract = new Contract(address, [method], provider)
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const result: unknown = await contract[method.name]()
    console.log(`Called ${address}.${method.name}()`)
    return {
      name: method.name,
      value: result,
    }
  } catch {
    return {
      name: method.name,
      value: undefined,
    }
  }
}

async function getArrayParameter(
  address: string,
  method: utils.FunctionFragment,
  provider: providers.Provider,
): Promise<Parameter> {
  const contract = new Contract(address, [method], provider)
  const results: unknown[] = []
  for (let i = 0; ; i++) {
    // eslint-disable-next-line
    const result: unknown = await contract[method.name](i).catch(
      () => undefined,
    )
    console.log(`Called ${address}.${method.name}(${i})`)
    if (result !== undefined) {
      results.push(result)
    } else {
      break
    }
  }
  return {
    name: method.name,
    value: results,
  }
}
