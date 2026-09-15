// A deliberately small discovery adapter. The deployment/source association is
// supplied by the snapshot, not verified against bytecode by this prototype.
export const snapshotSchema = {
  contractDefinition: ['contract', 'name'],
  contractVariable: ['contract', 'variable'],
  contractFunction: ['contract', 'function', 'selector'],
  externalCall: ['call', 'variable', 'selector'],
  snapshotDeployment: ['address', 'contract'],
  snapshotAddress: ['address', 'variable', 'value'],
}

export function snapshotFacts(ast, snapshot) {
  const facts = Object.fromEntries(Object.keys(snapshotSchema).map((name) => [name, []]))
  const contracts = ast.nodes.filter((n) => n.nodeType === 'ContractDefinition')
  const nodes = new Map()
  function index(n) {
    if (!n || typeof n !== 'object') return
    if (n.nodeType) nodes.set(n.id, n)
    Object.values(n).forEach(index)
  }
  index(ast)
  for (const c of contracts) {
    facts.contractDefinition.push([c.id, c.name])
    for (const n of c.nodes) {
      if (n.stateVariable) facts.contractVariable.push([c.id, n.id])
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
  if (!snapshot || typeof snapshot.label !== 'string' || !Array.isArray(snapshot.deployments)) throw new Error('Snapshot needs a label and deployments array.')
  const address = (value) => {
    if (typeof value !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(value)) throw new Error('Snapshot values must be 20-byte hex addresses.')
    return value.toLowerCase()
  }
  const seen = new Set()
  for (const d of snapshot.deployments) {
    const addr = address(d.address)
    if (seen.has(addr)) throw new Error('Duplicate deployment address in snapshot.')
    seen.add(addr)
    const matches = contracts.filter((c) => c.name === d.contract && c.contractKind === 'contract' && !c.abstract)
    if (matches.length !== 1) throw new Error(`Snapshot contract must identify one concrete declaration: ${d.contract}`)
    const c = matches[0]
    // Interface inheritance is fine; implementation inheritance requires dispatch modeling.
    if (c.linearizedBaseContracts.slice(1).some((id) => nodes.get(id)?.contractKind !== 'interface')) throw new Error('Snapshot lesson does not support implementation inheritance.')
    if (!d.values || typeof d.values !== 'object' || Array.isArray(d.values)) throw new Error('Snapshot deployment needs a values object.')
    facts.snapshotDeployment.push([addr, c.id])
    for (const [name, value] of Object.entries(d.values)) {
      const vars = c.nodes.filter((n) => n.stateVariable && n.name === name)
      const v = vars[0]
      if (vars.length !== 1 || !/^(address(?: payable)?|contract .+)$/.test(v.typeDescriptions.typeString)) throw new Error(`Snapshot field must be a declared address or contract variable: ${d.contract}.${name}`)
      facts.snapshotAddress.push([addr, v.id, address(value)])
    }
  }
  return facts
}
