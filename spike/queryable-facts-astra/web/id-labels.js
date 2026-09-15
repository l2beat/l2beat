// Presentation only. Compiler IDs, input facts, and Soufflé tuples stay numeric.
const idColumns = {
  contractDefinition: [0], contractVariable: [0, 1], contractFunction: [0, 1],
  externalCall: [0, 1], snapshotDeployment: [1], snapshotAddress: [1],
  externalDependency: [0, 1, 2], resolvedCall: [1, 3],
  functionDefinition: [0], stateVariable: [0], child: [0, 1],
  assignment: [0, 1], reference: [0, 1],
  functionVisibility: [0], functionKind: [0], internalCall: [0, 1],
  calls: [0, 1, 2], potentialWrite: [0, 1], entryWrite: [0, 1], writePathEdge: [0, 1, 2, 3, 4],
  withinFunction: [0, 1], directWrite: [0, 1, 2],
}

export function makeIdLabels(ast, locations) {
  const labels = new Map()
  const short = (text) => text.replace(/[^a-zA-Z0-9_$]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40)
  function visit(value, parent) {
    if (!value || typeof value !== 'object') return
    if (Array.isArray(value)) { value.forEach((item) => visit(item, parent)); return }
    if (Number.isInteger(value.id) && value.nodeType) {
      let label = value.nodeType
      if (value.nodeType === 'FunctionDefinition') label = value.name || value.kind
      else if (value.nodeType === 'VariableDeclaration') {
        const role = value.stateVariable ? 'state' : parent?.nodeType === 'ParameterList' ? 'parameter' : 'local'
        label = `${role}_${value.name || 'unnamed'}`
      } else if (value.nodeType === 'Identifier') label = `use_${value.name}`
      else if (value.nodeType === 'Assignment') label = `assign_${locations[value.leftHandSide.id]?.source || 'value'}`
      else if (value.nodeType === 'Block') label = 'block'
      else if (value.nodeType === 'ExpressionStatement') label = 'statement'
      else if (value.name) label = `${value.nodeType}_${value.name}`
      labels.set(value.id, `${value.id}_${short(label)}`)
    }
    Object.values(value).forEach((child) => visit(child, value.nodeType ? value : parent))
  }
  visit(ast)
  return labels
}

export function displayAtom(name, row, labels, raw = false) {
  const values = row.map((value, column) => {
    if (!raw && idColumns[name]?.includes(column) && typeof value === 'number') {
      return labels.get(value) || `${value}_unresolved`
    }
    return JSON.stringify(value)
  })
  return `${name}(${values.join(', ')}).`
}
