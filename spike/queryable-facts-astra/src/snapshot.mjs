// A deliberately small discovery adapter. The deployment/source association is
// supplied by the snapshot, not verified against bytecode by this prototype.
export const snapshotSchema = {
  contractDefinition: ['contract', 'name'],
  contractVariable: ['contract', 'variable'],
  contractFunction: ['contract', 'function', 'selector'],
  externalCall: ['call', 'variable', 'selector'],
  snapshotDeployment: ['address', 'contract'],
  addressVariable: ['variable'],
  snapshotValue: ['address', 'variable', 'type', 'value'],
}

export function snapshotFacts(asts, snapshot, locations) {
  const facts = Object.fromEntries(Object.keys(snapshotSchema).map((name) => [name, []]))
  const contracts = asts.flatMap((ast) => ast.nodes.filter((n) => n.nodeType === 'ContractDefinition'))
  const nodes = new Map()
  function index(n) {
    if (!n || typeof n !== 'object') return
    if (n.nodeType) nodes.set(n.id, n)
    Object.values(n).forEach(index)
  }
  index(asts)
  for (const c of contracts) {
    facts.contractDefinition.push([c.id, c.name])
    for (const n of c.nodes) {
      if (n.stateVariable) {
        facts.contractVariable.push([c.id, n.id])
        if (/^(address(?: payable)?|contract .+)$/.test(n.typeDescriptions.typeString)) facts.addressVariable.push([n.id])
      }
      // Only locally implemented ABI functions. No inherited or proxy dispatch.
      if (n.nodeType === 'FunctionDefinition' && n.body && n.functionSelector && !n.virtual) {
        facts.contractFunction.push([c.id, n.id, n.functionSelector])
      }
    }
  }
  for (const n of nodes.values()) {
    if (n.nodeType !== 'FunctionCall' || n.kind !== 'functionCall') continue
    const member = n.expression
    if (member.nodeType !== 'MemberAccess' || member.expression.nodeType !== 'Identifier') continue
    const variable = nodes.get(member.expression.referencedDeclaration)
    const method = nodes.get(member.referencedDeclaration)
    if (variable?.stateVariable && method?.nodeType === 'FunctionDefinition' && method.functionSelector && member.typeDescriptions?.typeIdentifier?.startsWith('t_function_external_')) {
      facts.externalCall.push([n.id, variable.id, method.functionSelector])
    }
  }
  if (snapshot === null) return facts
  if (!snapshot || typeof snapshot.name !== 'string' || !Array.isArray(snapshot.entries)) throw new Error('discovered.json needs a name and entries array.')
  const seen = new Set()
  for (const d of snapshot.entries) {
    const addr = normalizeAddress(d.address)
    if (seen.has(addr)) throw new Error('Duplicate deployment address in snapshot.')
    seen.add(addr)
    if (d.type === 'EOA') continue
    if (d.type !== 'Contract') throw new Error('Discovery entry type must be Contract or EOA.')
    // This lesson supports the simple discovery convention only. Do not guess
    // between repeated contract names or proxy/implementation files.
    const matches = contracts.filter((c) => c.name === d.name && locations[c.id].file === `.flat/${d.name}.sol` && c.contractKind === 'contract' && !c.abstract)
    if (matches.length !== 1) throw new Error(`Expected one concrete ${d.name} declaration in .flat/${d.name}.sol.`)
    const c = matches[0]
    if (d.proxyType && d.proxyType !== 'immutable') throw new Error('Proxy resolution is outside this lesson.')
    if (c.linearizedBaseContracts.slice(1).some((id) => nodes.get(id)?.contractKind !== 'interface')) throw new Error('Snapshot lesson does not support implementation inheritance.')
    if (!d.values || typeof d.values !== 'object' || Array.isArray(d.values)) throw new Error('Snapshot contract entry needs a values object.')
    facts.snapshotDeployment.push([addr, c.id])
    for (const [name, value] of Object.entries(d.values)) {
      const vars = c.nodes.filter((n) => n.stateVariable && n.name === name)
      if (vars.length !== 1) throw new Error(`Snapshot field must match a declared variable: ${d.name}.${name}`)
      const v = vars[0], type = v.typeDescriptions.typeString
      facts.snapshotValue.push([addr, v.id, type, encodeValue(value, type, addr)])
    }
  }
  return facts
}

function normalizeAddress(value, context = '') {
  if (typeof value !== 'string' || !/^(?:[a-z][a-z0-9]*:)?0x[0-9a-fA-F]{40}$/.test(value)) throw new Error('Expected a 20-byte hex address, optionally prefixed with a chain such as eth:.')
  const prefix = context.includes(':') ? context.split(':')[0] + ':' : ''
  return (value.includes(':') ? value : prefix + value).toLowerCase()
}

// Values remain data, not solver expressions. Decimal strings retain uint256
// precision; compound values are preserved as JSON without interpreting members.
function encodeValue(value, type, context) {
  function checkNumbers(v) {
    if (typeof v === 'number' && !Number.isSafeInteger(v)) throw new Error('Use decimal strings for integers beyond JavaScript safe precision.')
    if (v && typeof v === 'object') Object.values(v).forEach(checkNumbers)
  }
  checkNumbers(value)
  if (/^(address(?: payable)?|contract .+)$/.test(type)) return normalizeAddress(value, context)
  const integer = /^(u?int)([0-9]+)$/.exec(type)
  if (integer) {
    if (!['string', 'number'].includes(typeof value) || !/^-?[0-9]+$/.test(String(value))) throw new Error(`Expected a decimal ${type} value.`)
    const n = BigInt(value), bits = BigInt(integer[2]), signed = integer[1] === 'int'
    const min = signed ? -(1n << (bits - 1n)) : 0n
    const max = (1n << (bits - (signed ? 1n : 0n))) - 1n
    if (n < min || n > max) throw new Error(`Value is outside ${type} range.`)
    return n.toString()
  }
  if (type === 'bool' && typeof value !== 'boolean') throw new Error('Expected a boolean value.')
  if ((type === 'string' || /^bytes[0-9]*$/.test(type)) && typeof value !== 'string') throw new Error(`Expected a string for ${type}.`)
  return JSON.stringify(value)
}
