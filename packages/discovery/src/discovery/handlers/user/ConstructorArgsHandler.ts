import { assert } from '@l2beat/backend-tools'
import { ContractValue } from '@l2beat/discovery-types'
import { ethers } from 'ethers'
import { z } from 'zod'

import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ClassicHandler, HandlerResult } from '../Handler'

export type ConstructorArgsDefinition = z.infer<
  typeof ConstructorArgsDefinition
>
export const ConstructorArgsDefinition = z.strictObject({
  type: z.literal('constructorArgs'),
  nameArgs: z.boolean().optional(),
})

export class ConstructorArgsHandler implements ClassicHandler {
  readonly dependencies: string[] = []
  readonly constructorFragment: ethers.utils.Fragment

  constructor(
    readonly field: string,
    private readonly definition: ConstructorArgsDefinition,
    abi: string[],
    readonly logger: DiscoveryLogger,
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
    provider: DiscoveryProvider,
    address: EthereumAddress,
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
    provider: DiscoveryProvider,
    address: EthereumAddress,
  ): Promise<ContractValue> {
    try {
      const decodedConstructorArguments =
        await this.getWithDeploymentTransaction(provider, address)

      return serializeResult(decodedConstructorArguments)
    } catch (error) {
      this.logger.log(
        'Could not get constructor arguments with heuristic approach. Trying with block explorer.',
      )
      const decodedConstructorArguments = await this.getWithBlockExplorer(
        provider,
        address,
      )
      return serializeResult(decodedConstructorArguments)
    }
  }

  async getWithDeploymentTransaction(
    provider: DiscoveryProvider,
    address: EthereumAddress,
  ): Promise<ethers.utils.Result> {
    const deploymentTxHash = await provider.getContractDeploymentTx(address)
    if (deploymentTxHash === undefined) {
      throw new Error(
        "Can't discover constructor because getContractDeploymentTx is not available",
      )
    }

    const deploymentTx = await provider.getTransaction(deploymentTxHash)

    const decodedConstructorArguments = decodeConstructorArgs(
      this.constructorFragment,
      deploymentTx.data,
    )

    return decodedConstructorArguments
  }

  async getWithBlockExplorer(
    provider: DiscoveryProvider,
    address: EthereumAddress,
  ): Promise<ethers.utils.Result> {
    const encodedConstructorArguments =
      await provider.getConstructorArgs(address)

    const decodedConstructorArguments = ethers.utils.defaultAbiCoder.decode(
      this.constructorFragment.inputs,
      '0x' + encodedConstructorArguments,
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

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (result && typeof result === 'object') {
    return Object.fromEntries(
      Object.entries(result).map(([key, value]) => [
        key,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
  constructor: ethers.utils.Fragment,
  txData: string,
): ethers.utils.Result {
  assert(constructor, 'Constructor does not exist in abi')

  let longestDecodedArgs: ethers.utils.Result | undefined = undefined
  const offset = 64
  for (let i = txData.length - offset; i >= 0; i -= offset) {
    const slice = txData.slice(i)

    try {
      const offsetEncoded = ((i - 2) / 2).toString(16)
      if (!txData.includes(offsetEncoded)) {
        continue
      }

      longestDecodedArgs = ethers.utils.defaultAbiCoder.decode(
        constructor.inputs,
        '0x' + slice,
      )
    } catch (error) {
      continue
    }
  }

  if (!longestDecodedArgs) {
    throw new Error('Could not decode constructor args')
  }
  return longestDecodedArgs
}
