import { assert, Bytes, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ethers } from 'ethers'
import type { ContractValue } from '../../output/types'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type ConstructorArgsDefinition = v.infer<
  typeof ConstructorArgsDefinition
>
export const ConstructorArgsDefinition = v.strictObject({
  type: v.literal('constructorArgs'),
  nameArgs: v.boolean().optional(),
})

export class ConstructorArgsHandler implements Handler {
  readonly dependencies: string[] = []
  readonly constructorFragment: ethers.utils.Fragment

  constructor(
    readonly field: string,
    private readonly definition: ConstructorArgsDefinition,
    abi: string[],
  ) {
    assert(
      field === 'constructorArgs',
      'ConstructorArgsHandler can only be used for "constructorArgs" field',
    )

    const constructorFragment = new ethers.utils.Interface(abi).fragments.find(
      (f) => f.type === 'constructor',
    )
    assert(constructorFragment, 'Constructor does not exist in abi')
    this.constructorFragment = constructorFragment
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const result = await this.getSerializedConstructorArgs(provider, address)

    if (!this.definition.nameArgs || !Array.isArray(result)) {
      return {
        field: 'constructorArgs',
        value: result,
      }
    }

    const namedArgs = Object.fromEntries(
      this.constructorFragment.inputs.map((input, index) => [
        input.name,
        result[index],
      ]),
    )

    return {
      field: 'constructorArgs',
      value: namedArgs,
    }
  }

  async getSerializedConstructorArgs(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<ContractValue> {
    try {
      const decodedConstructorArguments =
        await this.getWithDeploymentTransaction(provider, address)

      return serializeResult(decodedConstructorArguments)
    } catch {
      const decodedConstructorArguments = await this.getWithBlockExplorer(
        provider,
        address,
      )
      return serializeResult(decodedConstructorArguments)
    }
  }

  async getWithDeploymentTransaction(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<ethers.utils.Result> {
    const deployment = await provider.getDeployment(address)
    if (deployment === undefined) {
      throw new Error(
        "Can't discover constructor because getDeployment is not available",
      )
    }

    const deploymentTx = await provider.getTransaction(
      deployment.transactionHash,
    )
    if (deploymentTx === undefined) {
      throw new Error(
        "Can't discover constructor because getTransaction is not available",
      )
    }

    const decodedConstructorArguments = decodeConstructorArgs(
      this.constructorFragment,
      deploymentTx.data,
    )

    return decodedConstructorArguments
  }

  async getWithBlockExplorer(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<ethers.utils.Result> {
    const { constructorArguments } = await provider.getSource(address)

    const decodedConstructorArguments = ethers.utils.defaultAbiCoder.decode(
      this.constructorFragment.inputs,
      '0x' + constructorArguments,
    )

    return decodedConstructorArguments
  }
}

/** @internal */
export function serializeResult(result: ethers.utils.Result): ContractValue {
  if (Array.isArray(result)) {
    return result.map(serializeResult)
  }

  if (result instanceof ethers.BigNumber) {
    return result.toString()
  }

  if (result && typeof result === 'object') {
    return Object.fromEntries(
      Object.entries(result).map(([key, value]) => [
        key,
        serializeResult(value),
      ]),
    )
  }

  if (
    typeof result === 'string' ||
    typeof result === 'number' ||
    typeof result === 'boolean'
  ) {
    return result
  }

  throw new Error(`Don't know how to serialize: ${typeof result}`)
}

/** @internal */
/**
 * Constructor args are ABI encoded and appended to init bytecode. Read more: https://ethereum.stackexchange.com/questions/13008/how-are-the-arguments-of-the-constructor-encoded-in-the-contract-creation-transa?rq=1
 * After this is done, there is no easy way to split constructor args from init bytecode.
 *
 * We use the following heuristic to decode constructor args:
 * 1. Iterate over the bytecode in reverse order in 32 byte chunks.
 * 2. Each chunk starting location should be encoded in the bytecode as a hex string because args have to be loaded from the bytecode into memory by init code.
 *    So if the index does not exist in the bytecode, for sure it is not a starting point of a constructor args.
 * 3. Try to decode the chunk as constructor args. Unfortunately, shorter chunks that actual args can be decoded as well (with some zero values).
 *    So we just pick the longest decoded chunk that works.
 *  */
export function decodeConstructorArgs(
  constructorFragment: ethers.utils.Fragment,
  txData: string,
): ethers.utils.Result {
  assert(constructorFragment, 'Constructor does not exist in abi')

  let longestDecodedArgs: ethers.utils.Result | undefined = undefined
  const offset = 64
  const bytecode = popLeadingZeros(txData)
  for (let i = bytecode.length - offset; i >= 0; i -= offset) {
    const slice = bytecode.slice(i)

    try {
      const offset = ((i - 2) / 2).toString(16)
      const offsetEncoded = offset.length % 2 === 0 ? offset : `0${offset}`
      if (!bytecode.includes(offsetEncoded)) {
        continue
      }

      longestDecodedArgs = ethers.utils.defaultAbiCoder.decode(
        constructorFragment.inputs,
        '0x' + slice,
      )
    } catch {
      continue
    }
  }

  if (!longestDecodedArgs) {
    throw new Error('Could not decode constructor args')
  }
  return longestDecodedArgs
}

function popLeadingZeros(data: string): string {
  const bytes = Bytes.fromHex(data)

  let index = 0
  while (bytes.get(index) === 0) {
    index += 1
  }

  return bytes.slice(index, bytes.length).toString()
}
