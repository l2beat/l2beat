// An observation-only adapter: no call traversal, guard inference, or permissions.
export const schema = {
  functionDefinition: ['id', 'name'],
  stateVariable: ['id', 'name'],
  child: ['parent', 'node'],
  assignment: ['node', 'left'],
  reference: ['node', 'declaration'],
}

export function extractFacts(ast, source) {
  const facts = Object.fromEntries(Object.keys(schema).map((name) => [name, []]))
  const locations = {}
  const bytes = Buffer.from(source, 'utf8')

  function visit(node, parent) {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      for (const item of node) visit(item, parent)
      return
    }
    const isNode = Number.isInteger(node.id) && typeof node.nodeType === 'string'
    if (isNode) {
      if (parent !== undefined) facts.child.push([parent, node.id])
      const [start, length] = node.src.split(':').map(Number)
      locations[node.id] = {
        kind: node.nodeType,
        line: bytes.subarray(0, start).toString('utf8').split('\n').length,
        source: bytes.subarray(start, start + length).toString('utf8'),
      }
      if (node.nodeType === 'FunctionDefinition') {
        facts.functionDefinition.push([node.id, node.name || node.kind])
      }
      if (node.nodeType === 'VariableDeclaration' && node.stateVariable) {
        facts.stateVariable.push([node.id, node.name])
      }
      if (node.nodeType === 'Assignment') {
        facts.assignment.push([node.id, node.leftHandSide.id])
      }
      if (node.nodeType === 'Identifier' && Number.isInteger(node.referencedDeclaration)) {
        facts.reference.push([node.id, node.referencedDeclaration])
      }
    }
    for (const value of Object.values(node)) {
      if (value && typeof value === 'object') visit(value, isNode ? node.id : parent)
    }
  }

  visit(ast)
  return { facts, locations }
}

// Soufflé's .facts files are its native tab-delimited input, not another analysis
// stage. The UI renders exactly the same tuples as relation(arg, ...).
export function inputText(rows) {
  return rows.map((row) => row.map((cell) => {
    const text = String(cell)
    if (/[\t\r\n]/.test(text)) throw new Error('Unexpected delimiter in a fact')
    return text
  }).join('\t') + '\n').join('')
}

export function atoms(name, rows) {
  return rows.map((row) => `${name}(${row.map((cell) => JSON.stringify(cell)).join(', ')}).`).join('\n')
}
