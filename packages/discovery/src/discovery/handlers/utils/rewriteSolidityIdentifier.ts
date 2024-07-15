/**
 * Because we reserve `$` to be a special prefix for known fields we cannot
 * allow abi entries to produce fields that start with `$`. This function
 * rewrites any identifier like that to start with `_$` instead.
 *
 * The unlikely collision of `$foo` and `_$foo` being present in the same
 * contract is unhandled and considered acceptable as it can be worked around
 * with custom handlers.
 */
export function rewriteSolidityIdentifier(identifier: string) {
  if (identifier.startsWith('$')) {
    return `_${identifier}`
  }
  return identifier
}
