// Render the same edges used by child(parent, node), not a second AST traversal.
export function renderAstTree(result, labels, raw, escape) {
  const children = new Map()
  for (const [parent, node] of result.facts.child) {
    if (!children.has(parent)) children.set(parent, [])
    children.get(parent).push(node)
  }
  const roots = Object.entries(result.compilerOutput.sources).map(([file, s]) => [file, s.ast.id])
  function node(id) {
    const descendants = children.get(id) || []
    const location = result.locations[id]
    const label = raw ? id : labels.get(id) || id
    const heading = `<span class="ast-kind">${escape(location.kind)}</span> <code>${escape(label)}</code>`
    if (!descendants.length) return `<div class="ast-node ast-leaf" data-node-id="${id}">${heading}</div>`
    return `<details class="ast-node" data-node-id="${id}" ${roots.some(([, root]) => root === id) ? 'open' : ''}>
      <summary>${heading}<span class="ast-count">${descendants.length} ${descendants.length === 1 ? 'child' : 'children'}</span></summary>
      <div class="ast-children">${descendants.map(node).join('')}</div>
    </details>`
  }
  return roots.map(([file, root]) => `<section><h4>${escape(file)}</h4>${node(root)}</section>`).join('')
}
