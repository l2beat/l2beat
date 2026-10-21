import { assert } from '@l2beat/shared-pure'

export interface AbiFunction {
  name: string
  arity: number
}

// Entries look like `function transfer(address to, uint256 amount) returns (bool)`.
export function parseAbiFunction(signature: string): AbiFunction | undefined {
  const prefix = 'function '
  if (!signature.startsWith(prefix)) {
    return undefined
  }
  const open = signature.indexOf('(')
  assert(open > prefix.length, 'Malformed ABI function')
  const name = signature.slice(prefix.length, open)

  let depth = 0
  let commas = 0
  let hasContent = false
  for (let i = open; i < signature.length; i++) {
    const char = signature[i]
    if (char === '(') {
      depth++
    } else if (char === ')') {
      depth--
      if (depth === 0) {
        return { name, arity: hasContent ? commas + 1 : 0 }
      }
    } else if (depth === 1 && char === ',') {
      commas++
    } else if (char !== ' ') {
      hasContent = true
    }
  }
  assert(false, 'Unbalanced parentheses in ABI function')
}

export function abiHasFunction(
  functions: AbiFunction[],
  name: string,
  arity: number | undefined,
): boolean {
  return functions.some(
    (f) => f.name === name && (arity === undefined || f.arity === arity),
  )
}
