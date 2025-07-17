import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { IProvider } from '../../provider/IProvider'
import { FunctionSelectorDecoder } from '../../utils/FunctionSelectorDecoder'
import type { Handler, HandlerResult } from '../Handler'

export type EIP2535FacetHandlerDefinition = v.infer<
  typeof EIP2535FacetHandlerDefinition
>
export const EIP2535FacetHandlerDefinition = v.strictObject({
  type: v.literal('eip2535Facets'),
  ignoreRelative: v.boolean().optional(),
})

type FacetsEntry = [EthereumAddress, string[]]

export class EIP2535FacetHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: EIP2535FacetHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const method =
      'function facets() view returns (tuple(address addr, bytes4[] selectors)[] result)'
    const facets = await provider.callMethod<FacetsEntry[]>(address, method, [])
    assert(
      facets !== undefined,
      'Facets call failed, maybe this contract is not an EIP2535 proxy',
    )

    const implementations = facets.map((facet) =>
      ChainSpecificAddress.fromLong(provider.chain, facet[0]),
    )
    const decoder = new FunctionSelectorDecoder(provider)
    await decoder.fetchTargets(implementations)

    const result: Record<string, string[]> = {}

    for (const facet of facets) {
      const [implementation, encodedSelectors] = facet

      const selectors = await Promise.all(
        encodedSelectors.map((encodedSelector) =>
          decoder.decodeSelector(
            ChainSpecificAddress.fromLong(provider.chain, implementation),
            encodedSelector,
          ),
        ),
      )

      result[implementation.toString()] = selectors
    }

    return {
      field: this.field,
      value: result,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}
