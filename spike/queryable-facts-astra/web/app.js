import { displayAtom, makeIdLabels } from './id-labels.js'
import { renderAstTree } from './ast-tree.js'
import { createReader } from './reader.js'

const $ = (id) => document.getElementById(id)
let examples = []
let currentRun
let idLabels = new Map()

const descriptions = {
  functionDefinition: 'A function declaration and its name.',
  stateVariable: 'A declaration marked stateVariable by the compiler.',
  child: 'An AST node directly contains another AST node.',
  assignment: 'An assignment expression and its left-hand node.',
  reference: 'An identifier and the declaration it refers to.',
}
const escape = (text) => String(text).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

// Color tokens after escaping their contents. Source and compiler strings are never HTML.
function highlight(text) {
  const pattern = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|-?\d+_[a-zA-Z0-9_$]+|\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?)\b|\.[a-zA-Z]+|\b(?:pragma|solidity|contract|interface|library|function|constructor|modifier|event|error|struct|enum|mapping|address|bool|string|bytes\d*|u?int\d*|public|private|internal|external|view|pure|payable|returns|return|if|else|for|while|do|break|continue|require|revert|assert|emit|new|delete|memory|storage|calldata|constant|immutable|virtual|override|true|false)\b|\b[A-Za-z_$][A-Za-z_0-9$]*(?=\s*\()/g
  let html = ''
  let position = 0
  for (const match of text.matchAll(pattern)) {
    html += escape(text.slice(position, match.index))
    const token = match[0]
    const kind = token.startsWith('//') || token.startsWith('/*') ? 'comment'
      : /^["']/.test(token) ? 'string' : /^-?\d/.test(token) ? 'number'
      : token.startsWith('.') || /^\s*\(/.test(text.slice(match.index + token.length)) ? 'relation' : 'keyword'
    html += `<span class="${kind}">${escape(token)}</span>`
    position = match.index + token.length
  }
  return html + escape(text.slice(position))
}
const reader = createReader({ escape, highlight })

function atom(name, row) { return displayAtom(name, row, idLabels, $('raw-ids').checked) }
function code(id, text) { $(id).innerHTML = highlight(text) }

function setEditing(editing) {
  $('source').hidden = !editing
  $('source-preview').hidden = editing
  $('edit-source').textContent = editing ? 'Done editing' : 'Edit source'
  $('edit-source').setAttribute('aria-expanded', String(editing))
  code('source-preview', $('source').value)
}

function invalidate() {
  reader.clear()
  code('source-preview', $('source').value)
  currentRun = undefined
  $('results').hidden = true
  $('empty').hidden = false
  $('error').hidden = true
  $('status').textContent = 'Ready to run · results will reflect this source'
}
function selectExample() {
  const example = examples.find((item) => item.id === $('example').value)
  $('source').value = example.source
  setEditing(false)
  $('example-description').textContent = example.description
  invalidate()
}

function render(result) {
  reader.update(result)
  currentRun = result
  $('results').hidden = false
  $('empty').hidden = true
  const count = Object.values(result.facts).reduce((sum, rows) => sum + rows.length, 0)
  $('fact-count').textContent = `${count} base facts`
  $('finding-count').textContent = `${result.findings.length} ${result.findings.length === 1 ? 'site' : 'sites'}`
  $('compiler-version').textContent = `Compiled with solc ${result.compilerVersion}`
  const ast = result.compilerOutput.sources['Playground.sol'].ast
  idLabels = makeIdLabels(ast, result.locations)
  $('ast-tree').innerHTML = renderAstTree(result, idLabels, $('raw-ids').checked, escape)
  function assignments(value) {
    if (!value || typeof value !== 'object') return []
    return [...(value.nodeType === 'Assignment' ? [value] : []), ...Object.values(value).flatMap(assignments)]
  }
  code('compiler-excerpts', JSON.stringify(assignments(ast), null, 2))
  code('ast', JSON.stringify(ast, null, 2))
  code('storage', JSON.stringify(result.compilerOutput.contracts?.['Playground.sol'] ?? {}, null, 2))
  $('warnings').innerHTML = result.warnings.length ? `<details><summary>Compiler diagnostics (${result.warnings.length})</summary><pre>${escape(result.warnings.join('\n'))}</pre></details>` : ''
  $('facts').innerHTML = Object.entries(result.facts).map(([name, rows]) => `
    <details class="relation-card" ${name === 'child' || name === 'reference' ? '' : 'open'}>
      <summary><code>${escape(name)}</code><span>${rows.length} facts</span></summary>
      <p>${descriptions[name]} <code>${name}(${result.schema[name].join(', ')})</code></p>
      <pre class="code long">${highlight(rows.map((row) => atom(name, row)).join('\n') || '// No tuples in this relation.')}</pre>
    </details>`).join('')
  code('rules', result.rules)
  $('findings').innerHTML = result.findings.map((finding) => {
    const [fn, variable, assignment] = finding.tuple
    const lhs = result.facts.assignment.find(([id]) => id === assignment)[1]
    const parents = new Map(result.facts.child.map(([parent, child]) => [child, parent]))
    const chain = []
    for (let node = assignment; node !== fn && parents.has(node); node = parents.get(node)) {
      chain.unshift(atom('child', [parents.get(node), node]))
    }
    const premises = [
      atom('functionDefinition', [fn, finding.function]), ...chain,
      atom('assignment', [assignment, lhs]), atom('reference', [lhs, variable]),
      atom('stateVariable', [variable, finding.variable]),
    ].join('\n')
    return `<article class="finding"><span class="potential">POTENTIAL WRITER</span>
      <h3>${escape(finding.function)} → ${escape(finding.variable)}</h3>
      <p>This function contains a direct assignment at line ${finding.line}.</p>
      <pre class="code">${highlight(finding.assignment)}</pre>
      <p class="caption">Derived by Soufflé</p><pre class="code atom">${highlight(atom('directWrite', finding.tuple))}</pre>
      <details><summary>Input facts behind this tuple</summary><p>The child chain establishes <code>${escape(atom('withinFunction', [fn, assignment]).slice(0, -1))}</code>. The other facts complete the direct-write rule.</p><pre class="code">${highlight(premises)}</pre></details>
    </article>`
  }).join('') || '<p>No direct assignments matched this rule. This is not a proof that the functions cannot write storage.</p>'
  $('scope').innerHTML = result.scope.map((item) => `<li>${escape(item)}</li>`).join('')
  $('artifact-path').textContent = result.runDir
  $('status').textContent = `Complete · ${count} base facts · ${result.findings.length} write sites · ${result.elapsedMs} ms`
}

$('edit-source').addEventListener('click', () => {
  setEditing($('source').hidden)
  if (!$('source').hidden) $('source').focus()
})
$('collapse-tree').addEventListener('click', () => {
  if (currentRun) $('ast-tree').innerHTML = renderAstTree(currentRun, idLabels, $('raw-ids').checked, escape)
})
$('raw-ids').addEventListener('change', () => {
  if (!currentRun) return
  // Preserve the reader's expanded facts/evidence when changing notation.
  const details = [...document.querySelectorAll('#ast-tree details, #facts details, #findings details')].map((item) => item.open)
  render(currentRun)
  document.querySelectorAll('#ast-tree details, #facts details, #findings details').forEach((item, index) => { item.open = details[index] })
})
$('source').addEventListener('input', invalidate)
$('example').addEventListener('change', selectExample)
$('reset').addEventListener('click', selectExample)
$('run').addEventListener('click', async () => {
  invalidate()
  setEditing(false)
  $('status').textContent = 'Compiling Solidity and running Soufflé…'
  for (const id of ['run', 'reset', 'example', 'source', 'edit-source']) $(id).disabled = true
  try {
    const response = await fetch('/api/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: $('source').value }) })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error)
    render(result)
  } catch (error) {
    $('error').hidden = false
    $('error').textContent = error.message
    $('status').textContent = 'Run failed · no results shown'
  } finally {
    for (const id of ['run', 'reset', 'example', 'source', 'edit-source']) $(id).disabled = false
  }
})
$('download').addEventListener('click', () => {
  if (!currentRun) return
  const url = URL.createObjectURL(new Blob([JSON.stringify(currentRun, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'astra-stage-01.json'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
})

try {
  const response = await fetch('/api/examples')
  if (!response.ok) throw new Error('Could not load the examples')
  examples = await response.json()
  $('example').innerHTML = examples.map((example) => `<option value="${example.id}">${escape(example.title)}</option>`).join('')
  selectExample()
} catch (error) {
  $('error').hidden = false
  $('error').textContent = error.message
  $('run').disabled = true
}
