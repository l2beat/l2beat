// Model of a Sierra (Cairo 1) contract ABI, as returned on-chain by
// starknet_getClassAt. The ABI is a JSON array of entries; entries produced by
// unknown future compilers are skipped rather than rejected.

export interface SierraParam {
  name: string
  type: string
}

export interface SierraFunction {
  name: string
  /** Interface the function belongs to, e.g. 'privacy::interface::IViews' */
  interfaceName?: string
  inputs: SierraParam[]
  outputs: { type: string }[]
  stateMutability: 'view' | 'external'
}

export interface SierraEventMember {
  name: string
  type: string
  kind: 'key' | 'data' | 'nested' | 'flat'
}

export interface SierraEvent {
  /** Full path, e.g. 'privacy::events::Deposit' */
  name: string
  kind: 'struct' | 'enum'
  members: SierraEventMember[]
}

export interface SierraAbi {
  functions: SierraFunction[]
  events: SierraEvent[]
  structs: Map<string, SierraParam[]>
  enums: Map<string, SierraParam[]>
  constructorInputs: SierraParam[]
}

export function hasFunction(abi: SierraAbi, name: string): boolean {
  return abi.functions.some((f) => f.name === name)
}

export function getViewFunctions(abi: SierraAbi): SierraFunction[] {
  return abi.functions.filter((f) => f.stateMutability === 'view')
}

export function parseSierraAbi(rawAbi: string | unknown[]): SierraAbi {
  const entries: unknown[] =
    typeof rawAbi === 'string' ? JSON.parse(rawAbi) : rawAbi

  const abi: SierraAbi = {
    functions: [],
    events: [],
    structs: new Map(),
    enums: new Map(),
    constructorInputs: [],
  }

  if (!Array.isArray(entries)) {
    return abi
  }

  for (const entry of entries) {
    if (typeof entry !== 'object' || entry === null) {
      continue
    }
    // biome-ignore lint/suspicious/noExplicitAny: dynamic JSON traversal
    const e = entry as any
    switch (e.type) {
      case 'function':
        abi.functions.push(parseFunction(e))
        break
      case 'interface':
        for (const item of e.items ?? []) {
          if (item?.type === 'function') {
            abi.functions.push(parseFunction(item, e.name))
          }
        }
        break
      case 'struct':
        abi.structs.set(e.name, parseParams(e.members))
        break
      case 'enum':
        abi.enums.set(e.name, parseParams(e.variants))
        break
      case 'event':
        abi.events.push({
          name: e.name,
          kind: e.kind === 'enum' ? 'enum' : 'struct',
          members: (e.kind === 'enum' ? e.variants : (e.members ?? []))?.map(
            // biome-ignore lint/suspicious/noExplicitAny: dynamic JSON traversal
            (m: any) => ({
              name: m.name,
              type: m.type,
              kind: m.kind ?? 'data',
            }),
          ),
        })
        break
      case 'constructor':
        abi.constructorInputs = parseParams(e.inputs)
        break
      // 'impl', 'l1_handler' and unknown entries carry no data we need
    }
  }

  return abi
}

// biome-ignore lint/suspicious/noExplicitAny: dynamic JSON traversal
function parseFunction(e: any, interfaceName?: string): SierraFunction {
  return {
    name: e.name,
    interfaceName,
    inputs: parseParams(e.inputs),
    outputs: (e.outputs ?? []).map((o: { type: string }) => ({ type: o.type })),
    stateMutability: e.state_mutability === 'view' ? 'view' : 'external',
  }
}

// biome-ignore lint/suspicious/noExplicitAny: dynamic JSON traversal
function parseParams(params: any): SierraParam[] {
  if (!Array.isArray(params)) {
    return []
  }
  return params.map((p) => ({ name: p.name, type: p.type }))
}

/** Last segment of a Cairo path, e.g. 'IViews' from 'privacy::interface::IViews' */
export function shortName(path: string): string {
  const withoutGenerics = path.split('<')[0] ?? path
  const segments = withoutGenerics.split('::').filter((s) => s !== '')
  return segments[segments.length - 1] ?? path
}
