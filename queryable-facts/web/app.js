import { displayAtom, makeIdLabels } from './id-labels.js'
import { renderAstTree } from './ast-tree.js'
import { createReader } from './reader.js'
import { symbolIndex } from '/briefing.mjs'

const $ = (id) => document.getElementById(id)
let examples = []
let currentRun
let idLabels = new Map()
let symbolLabels = new Map()

const descriptions = {
  contractDefinition: 'A contract or interface declaration.',
  contractVariable: 'A state variable declared in a contract.',
  contractFunction: 'A locally implemented ABI function and its compiler selector.',
  externalCall: 'A high-level external call directly through a state variable.',
  snapshotDeployment: 'A supplied address-to-source-contract association.',
  addressVariable: 'A state variable whose Solidity type is an address or contract reference.',
  snapshotValue: 'A supplied value with its Solidity type, tied to a specific deployment and variable.',
  functionDefinition: 'A function declaration and its name.',
  stateVariable: 'A declaration marked stateVariable by the compiler.',
  child: 'An AST node directly contains another AST node.',
  assignment: 'An assignment expression and its left-hand node.',
  reference: 'An identifier and the declaration it refers to.',
  functionVisibility: 'The visibility written on a function declaration.',
  functionKind: 'A regular function, constructor, fallback or receive.',
  internalCall: 'A plain internal call and its compiler-resolved, implemented non-virtual function declaration.',
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
  const sources = Object.entries(example.sources ?? { 'Playground.sol': example.source })
  $('source').value = sources[0][1]
  $('source').dataset.file = sources[0][0]
  $('source-file').textContent = sources[0][0]
  $('additional-sources').innerHTML = sources.slice(1).map(([file, source]) => `<section class="additional-source"><div class="file-label"><b>${escape(file)}</b><button type="button" class="secondary extra-edit" aria-expanded="false">Edit source</button></div><pre class="source-code extra-preview">${highlight(source)}</pre><textarea class="extra-source" data-file="${escape(file)}" aria-label="${escape(file)} source" spellcheck="false" hidden>${escape(source)}</textarea></section>`).join('')
  $('snapshot').value = JSON.stringify(example.snapshot ?? { name: 'synthetic', entries: [] }, null, 2)
  $('attach-snapshot').checked = false
  setEditing(false)
  $('example-description').textContent = example.description
  invalidate()
}

function render(result) {
  reader.update(result)
  currentRun = result
  // Reuse the file-aware symbol index; keep raw fact names unchanged.
  symbolLabels = new Map(symbolIndex(result).map((symbol) => [Number(symbol.id), symbol.label.split('(')[0]]))
  $('results').hidden = false
  $('empty').hidden = true
  const count = Object.values(result.facts).reduce((sum, rows) => sum + rows.length, 0)
  $('fact-count').textContent = `${count} base facts`
  $('finding-count').textContent = `${result.findings.length} ${result.findings.length === 1 ? 'site' : 'sites'}`
  $('compiler-version').textContent = `Compiled with solc ${result.compilerVersion}`
  const ast = Object.values(result.compilerOutput.sources).map((s) => s.ast)
  idLabels = makeIdLabels(ast, result.locations)
  $('ast-tree').innerHTML = renderAstTree(result, idLabels, $('raw-ids').checked, escape)
  function assignments(value) {
    if (!value || typeof value !== 'object') return []
    return [...(value.nodeType === 'Assignment' ? [value] : []), ...Object.values(value).flatMap(assignments)]
  }
  code('compiler-excerpts', JSON.stringify(assignments(ast), null, 2))
  code('ast', JSON.stringify(ast, null, 2))
  code('storage', JSON.stringify(result.compilerOutput.contracts ?? {}, null, 2))
  $('warnings').innerHTML = result.warnings.length ? `<details><summary>Compiler diagnostics (${result.warnings.length})</summary><pre>${escape(result.warnings.join('\n'))}</pre></details>` : ''
  $('facts').innerHTML = Object.entries(result.facts).map(([name, rows]) => `
    <details class="relation-card" ${name === 'child' || name === 'reference' ? '' : 'open'}>
      <summary><code>${escape(name)}</code><span>${rows.length} facts</span></summary>
      <p>${descriptions[name]} <code>${name}(${result.schema[name].join(', ')})</code></p>
      <pre class="code long">${highlight(rows.map((row) => atom(name, row)).join('\n') || '// No tuples in this relation.')}</pre>
    </details>`).join('')
  code('rules', result.directRules ?? result.rules)
  renderCalls(result)
  renderConnections(result)
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
      <h3>${escape(symbolLabels.get(fn))} → ${escape(symbolLabels.get(variable))}</h3>
      <p>This function contains a direct assignment in ${escape(finding.file)} · line ${finding.line}.</p>
      <pre class="code">${highlight(finding.assignment)}</pre>
      <p class="caption">Derived by Soufflé</p><pre class="code atom">${highlight(atom('directWrite', finding.tuple))}</pre>
      <details><summary>Input facts behind this tuple</summary><p>The child chain establishes <code>${escape(atom('withinFunction', [fn, assignment]).slice(0, -1))}</code>. The other facts complete the direct-write rule.</p><pre class="code">${highlight(premises)}</pre></details>
    </article>`
  }).join('') || '<p>No direct assignments matched this rule. This is not a proof that the functions cannot write storage.</p>'
  $('scope').innerHTML = result.scope.map((item) => `<li>${escape(item)}</li>`).join('')
  $('artifact-path').textContent = result.runDir
  $('status').textContent = `Complete · ${count} base facts · ${result.findings.length} write sites · ${result.elapsedMs} ms`
}

// Render the returned graph once per entry/variable; cycles and shared helpers
// link back to an already shown function instead of enumerating arbitrary paths.
function renderCalls(result) {
  $('call-section').hidden = !result.followCalls
  if (!result.followCalls) return
  code('call-rules', result.callRules)
  const names = symbolLabels
  const variables = symbolLabels
  const visibility = new Map(result.facts.functionVisibility)
  $('entry-findings').innerHTML = result.derived.entryWrite.map(([entry, variable]) => {
    const edges = result.derived.writePathEdge.filter(([e, v]) => e === entry && v === variable)
    const seen = new Set()
    function branch(fn, callSite) {
      const label = `${names.get(fn)} · ${visibility.get(fn)}`
      if (seen.has(fn)) return `<li><span>${escape(label)} · already shown (shared helper or cycle)</span></li>`
      seen.add(fn)
      const writes = result.findings.filter((f) => f.tuple[0] === fn && f.tuple[1] === variable)
      const children = edges.filter(([, , caller]) => caller === fn).map(([, , , callee, site]) => branch(callee, site)).join('')
      const location = result.locations[fn]
      return `<li><b>${escape(label)}</b>${callSite ? `<span class="caption"> · call at line ${result.locations[callSite].line}</span>` : ''}
        <details><summary>Read ${escape(names.get(fn))} · ${escape(location.file)}:${location.line}</summary><pre class="code">${highlight(location.source)}</pre></details>
        ${writes.map((f) => `<p class="path-write">↳ assigns ${escape(symbolLabels.get(f.tuple[1]))} at line ${f.line}</p>`).join('')}
        ${children ? `<ul>${children}</ul>` : ''}</li>`
    }
    return `<article class="finding"><span class="potential">EXTERNALLY CALLABLE POTENTIAL WRITER</span>
      <h3>${escape(names.get(entry))} → ${escape(variables.get(variable))}</h3>
      <ul class="call-tree">${branch(entry)}</ul>
      <pre class="code">${highlight(atom('entryWrite', [entry, variable]))}</pre>
      <p class="caption">Read every function along the path, including intermediate helpers. Guards are interpreted from source, not inferred by these rules.</p></article>`
  }).join('') || '<p>No entry-point writer matched the supported call and assignment forms. This is not a proof that storage cannot change.</p>'
  $('call-tuples').innerHTML = Object.entries(result.derived).filter(([name]) => !['externalDependency', 'resolvedCall'].includes(name)).map(([name, rows]) => `<h3>${escape(name)} · ${rows.length}</h3><pre class="code long">${highlight(rows.map((row) => atom(name, row)).join('\n') || '// No tuples')}</pre>`).join('')
}

function renderConnections(result) {
  $('connection-section').hidden = !result.connectContracts
  if (!result.connectContracts) return
  code('connection-rules', result.connectionRules)
  $('snapshot-status').textContent = result.snapshot ? `Using ${result.snapshot.name}/discovered.json (synthetic data). Entries associate each contract name with its deployed address and current values.` : 'No discovered.json attached. We can locate the call in source, but cannot select a deployed target from the available implementations.'
  const names = symbolLabels
  const vars = new Map(result.facts.stateVariable)
  const contracts = new Map(result.facts.contractDefinition)
  const deployments = new Map(result.facts.snapshotDeployment)
  const variableContract = (variable) => result.facts.contractVariable.find(([, v]) => v === variable)?.[0]
  const fnLabel = (fn) => names.get(fn)
  $('connection-findings').innerHTML = result.derived.externalDependency.map(([fn, call, variable]) => {
    const targets = result.derived.resolvedCall.filter(([, c]) => c === call)
    const location = result.locations[call]
    const field = `${contracts.get(variableContract(variable))}.${vars.get(variable)}`
    return `<article class="finding"><h3>${escape(fnLabel(fn))} calls ${escape(location.source.split('(')[0])}</h3>
      <p class="caption">Call site · ${escape(location.file)}:${location.line}</p>
      <pre class="code">${highlight(location.source)}</pre>
      <details><summary>Read the calling function in context</summary><pre class="code">${highlight(result.locations[fn].source)}</pre></details>
      ${targets.length ? targets.map(([from, , to, target]) => `<ol class="connection-path">
        <li><span class="eyebrow">CALLING CONTRACT</span><h4>${escape(contracts.get(deployments.get(from)))}</h4><p>Deployed at <code>${escape(from)}</code></p></li>
        <li><span class="eyebrow">REFERENCE VALUE FROM DISCOVERY</span><h4>${escape(field)}</h4><p>This variable holds <code>${escape(to)}</code>.</p><p>That address belongs to <b>${escape(contracts.get(deployments.get(to)))}</b> in discovered.json.</p></li>
        <li><span class="eyebrow">MATCHING TARGET FUNCTION</span><h4>${escape(fnLabel(target))}</h4><p>${escape(result.locations[target].file)} · line ${result.locations[target].line}</p><pre class="code">${highlight(result.locations[target].source)}</pre></li>
      </ol>`).join('') : '<p><b>Target unresolved.</b> The call signature is known, but no target implementation was resolved from discovery. Available source files alone do not establish the deployed target.</p>'}
      <details><summary>How the rule connects these pieces</summary><p><code>externalDependency</code> locates the call in the function. <code>resolvedCall</code> joins the calling deployment, the value of <b>${escape(field)}</b>, the target deployment, and the compiler’s ABI selector. This is a source lookup, not an authorization check.</p></details>
      <p class="caption">A normal external call makes the calling contract the target’s msg.sender. Explicit arguments are separate; read which identity the target checks.</p></article>`
  }).join('') || '<p>No supported external calls found. Other call forms are outside this lesson.</p>'
  if (result.snapshot) {
    $('connection-findings').innerHTML += `<h3>Current values from discovered.json</h3><p>Each table belongs to one deployed contract. Omitted fields are unknown, not zero.</p>` + result.facts.snapshotDeployment.map(([address, contract]) => {
      const values = result.facts.snapshotValue.filter(([a]) => a === address)
      return `<section class="deployment-values"><h4>${escape(contracts.get(contract))}</h4><p>Deployed at <code>${escape(address)}</code> · source <code>.flat/${escape(contracts.get(contract))}.sol</code></p><div class="table-scroll"><table><thead><tr><th>State variable</th><th>Solidity type</th><th>Current value</th></tr></thead><tbody>${values.map(([, variable, type, value]) => `<tr><td>${escape(vars.get(variable))}</td><td><code>${escape(type)}</code></td><td><code>${escape(value)}</code></td></tr>`).join('')}</tbody></table></div></section>`
    }).join('')
  }
  const relations = { snapshotDeployment: result.facts.snapshotDeployment, snapshotValue: result.facts.snapshotValue, externalDependency: result.derived.externalDependency, resolvedCall: result.derived.resolvedCall }
  $('connection-tuples').innerHTML = Object.entries(relations).map(([name, rows]) => `<h3>${escape(name)}</h3><pre class="code">${highlight(rows.map((row) => atom(name, row)).join('\n') || '// No tuples')}</pre>`).join('')
}

function sourceInputs() { return [$('source'), ...document.querySelectorAll('.extra-source')] }
$('additional-sources').addEventListener('input', invalidate)
$('additional-sources').addEventListener('click', (event) => {
  const button = event.target.closest('.extra-edit')
  if (!button) return
  const section = button.closest('.additional-source')
  const input = section.querySelector('textarea'), preview = section.querySelector('pre')
  input.hidden = !input.hidden
  preview.hidden = !input.hidden
  preview.innerHTML = highlight(input.value)
  button.textContent = input.hidden ? 'Edit source' : 'Done editing'
  button.setAttribute('aria-expanded', String(!input.hidden))
})

$('connect-contracts').addEventListener('change', () => {
  $('snapshot-input').hidden = !$('connect-contracts').checked
  invalidate()
})
$('attach-snapshot').addEventListener('change', invalidate)
$('snapshot').addEventListener('input', invalidate)

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
  const details = [...document.querySelectorAll('#ast-tree details, #facts details, #findings details, #call-section details, #connection-section details')].map((item) => item.open)
  render(currentRun)
  document.querySelectorAll('#ast-tree details, #facts details, #findings details, #call-section details, #connection-section details').forEach((item, index) => { item.open = details[index] })
})
$('follow-calls').addEventListener('change', invalidate)
$('source').addEventListener('input', invalidate)
$('example').addEventListener('change', selectExample)
$('reset').addEventListener('click', selectExample)
$('run').addEventListener('click', async () => {
  invalidate()
  setEditing(false)
  $('status').textContent = 'Compiling Solidity and running Soufflé…'
  for (const id of ['run', 'reset', 'example', 'source', 'edit-source', 'follow-calls', 'connect-contracts', 'attach-snapshot', 'snapshot']) $(id).disabled = true
  for (const input of document.querySelectorAll('.extra-source, .extra-edit')) input.disabled = true
  try {
    const response = await fetch('/api/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sources: Object.fromEntries(sourceInputs().map((input) => [input.dataset.file, input.value])), followCalls: $('follow-calls').checked, connectContracts: $('connect-contracts').checked, snapshot: $('connect-contracts').checked && $('attach-snapshot').checked ? JSON.parse($('snapshot').value) : null }) })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error)
    render(result)
  } catch (error) {
    $('error').hidden = false
    $('error').textContent = error.message
    $('status').textContent = 'Run failed · no results shown'
  } finally {
    for (const input of document.querySelectorAll('.extra-source, .extra-edit')) input.disabled = false
    for (const id of ['run', 'reset', 'example', 'source', 'edit-source', 'follow-calls', 'connect-contracts', 'attach-snapshot', 'snapshot']) $(id).disabled = false
  }
})
$('download').addEventListener('click', () => {
  if (!currentRun) return
  const url = URL.createObjectURL(new Blob([JSON.stringify(currentRun, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `queryable-facts-${currentRun.stage}.json`
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
