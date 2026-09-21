/**
 * V1's value formatting, applied in V1's order.
 *
 * The benchmark compares V2 fields with committed `discovered.json` files
 * field by field, so a number, a big integer, an address or a struct must
 * render byte-identically. V1 (`callMethod` + `decodeHandlerResults`) does
 * `toContractValue`, then `prefixAddresses`, then `asStructured` with the
 * fragment's outputs; this module composes exactly those three functions,
 * imported from `@l2beat/discovery`, and nothing else.
 */
import {
  asStructured,
  type ContractValue,
  prefixAddresses,
  toContractValue,
} from '@l2beat/discovery'
import type { utils } from 'ethers'

/** BigNumbers to number or decimal string, addresses to `short:0x…`. */
export function formatValue(chain: string, decoded: unknown): ContractValue {
  return prefixAddresses(chain, toContractValue(decoded))
}

/**
 * A decoded call result as V1 writes it: named tuple outputs become objects,
 * positional ones stay arrays. Throws when the value does not match the
 * fragment's outputs, as V1 does; callers record that as the field's error.
 */
export function formatCallResult(
  chain: string,
  decoded: unknown,
  fragment: utils.FunctionFragment,
): ContractValue {
  return asStructured(formatValue(chain, decoded), fragment.outputs)
}

/**
 * Decoded event arguments keyed by name. V1's event handler keys by the
 * named entries of the ethers `Result`; unnamed parameters get `_<index>` so
 * every argument stays addressable from a recipe.
 */
export function formatLogArgs(
  chain: string,
  args: utils.Result,
  fragment: utils.EventFragment,
): Record<string, ContractValue> {
  return Object.fromEntries(
    fragment.inputs.map((input, i) => [
      input.name || `_${i}`,
      formatValue(chain, args[i]),
    ]),
  )
}
