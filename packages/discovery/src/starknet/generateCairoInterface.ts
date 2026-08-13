// Renders a Sierra ABI as readable Cairo-like source. Used as the .flat
// content for unverified classes and to produce the human-readable ABI
// strings shown in the UI.

import type { SierraAbi, SierraFunction, SierraParam } from './sierraAbi'
import { shortName } from './sierraAbi'

export function generateCairoInterface(
  contractName: string,
  classHash: string,
  abi: SierraAbi,
): string {
  const lines: string[] = [
    `// Interface of ${contractName}`,
    `// Generated from the on-chain Sierra ABI of class ${classHash}.`,
    '// This is not verified source code.',
    '',
  ]

  for (const [name, members] of abi.structs) {
    lines.push(`struct ${name} {`)
    for (const member of members) {
      lines.push(`    ${member.name}: ${member.type},`)
    }
    lines.push('}', '')
  }

  for (const [name, variants] of abi.enums) {
    lines.push(`enum ${name} {`)
    for (const variant of variants) {
      lines.push(
        variant.type === '()'
          ? `    ${variant.name},`
          : `    ${variant.name}: ${variant.type},`,
      )
    }
    lines.push('}', '')
  }

  for (const event of abi.events) {
    if (event.kind === 'enum') {
      continue // enum events only aggregate the per-variant definitions
    }
    lines.push(`event ${event.name} {`)
    for (const member of event.members) {
      lines.push(`    ${member.name}: ${member.type}, // ${member.kind}`)
    }
    lines.push('}', '')
  }

  const byInterface = new Map<string, SierraFunction[]>()
  for (const fn of abi.functions) {
    const key = fn.interfaceName ?? ''
    byInterface.set(key, [...(byInterface.get(key) ?? []), fn])
  }

  for (const [interfaceName, functions] of byInterface) {
    const indent = interfaceName === '' ? '' : '    '
    if (interfaceName !== '') {
      lines.push(`trait ${interfaceName} {`)
    }
    for (const fn of functions) {
      lines.push(`${indent}${functionSignature(fn)};`)
    }
    if (interfaceName !== '') {
      lines.push('}')
    }
    lines.push('')
  }

  return `${lines.join('\n').trimEnd()}\n`
}

export function functionSignature(fn: SierraFunction): string {
  const params = fn.inputs.map((i) => `${i.name}: ${i.type}`).join(', ')
  const returns =
    fn.outputs.length === 0
      ? ''
      : ` -> ${fn.outputs.map((o) => o.type).join(', ')}`
  const mutability = fn.stateMutability === 'view' ? '' : ' // external'
  return `fn ${fn.name}(${params})${returns}${mutability}`
}

/** Human-readable ABI strings for discovered.json, one per function and event */
export function generateAbiStrings(abi: SierraAbi): string[] {
  const entries: string[] = []
  for (const fn of abi.functions) {
    const params = fn.inputs.map((i) => `${i.name}: ${shorten(i.type)}`)
    const returns =
      fn.outputs.length === 0
        ? ''
        : ` -> ${fn.outputs.map((o) => shorten(o.type)).join(', ')}`
    const suffix = fn.stateMutability === 'view' ? ' view' : ''
    entries.push(`fn ${fn.name}(${params.join(', ')})${returns}${suffix}`)
  }
  for (const event of abi.events) {
    if (event.kind === 'enum') {
      continue
    }
    const members = event.members.map((m) => `${m.name}: ${shorten(m.type)}`)
    entries.push(`event ${shortName(event.name)}(${members.join(', ')})`)
  }
  return entries.sort()
}

/** core::starknet::contract_address::ContractAddress -> ContractAddress, keeping generics readable */
function shorten(type: string): string {
  return type
    .replace(/@/g, '')
    .split(/([<>,()\s])/)
    .map((token) =>
      token.includes('::') ? (shortName(token) ?? token) : token,
    )
    .join('')
}

export function deriveContractName(
  abi: SierraAbi,
  fallback: string,
): SierraParam['name'] {
  // Prefer the first application-specific interface, skipping stdlib-ish ones
  const interfaces = [
    ...new Set(
      abi.functions
        .map((f) => f.interfaceName)
        .filter((n): n is string => n !== undefined),
    ),
  ]
  const preferred =
    interfaces.find(
      (i) => !i.startsWith('core::') && !i.startsWith('openzeppelin'),
    ) ?? interfaces[0]
  if (preferred === undefined) {
    return fallback
  }
  const name = shortName(preferred)
  // IViews -> Views
  return name.length > 1 && name.startsWith('I') ? name.slice(1) : name
}
