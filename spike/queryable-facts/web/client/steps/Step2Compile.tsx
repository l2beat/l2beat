import { useMemo, useState } from 'react'
import { childNodes } from '../../../src/ast'
import type { AstNode } from '../../shared/types'
import { AstTree, nodeLabel } from '../components/AstTree'
import { JsonView } from '../components/JsonView'
import { type Highlight, SourceView } from '../components/SourceView'
import { Callout, ms, Panel, Stat } from '../components/ui'
import { useRun } from '../lib/context'

/** The node without its child nodes: the fields the compiler attached to this one construct. */
function ownFields(node: AstNode): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(node)) {
    if (k === 'typeDescriptions' || k === 'argumentTypes') continue
    const isChild = (x: unknown) =>
      typeof x === 'object' && x !== null && 'nodeType' in (x as object)
    if (isChild(v)) {
      out[k] = `<${(v as AstNode).nodeType}>`
    } else if (Array.isArray(v) && v.some(isChild)) {
      out[k] = `<${v.length} child node${v.length === 1 ? '' : 's'}>`
    } else {
      out[k] = v
    }
  }
  const td = (node as { typeDescriptions?: unknown }).typeDescriptions
  if (td) out.typeDescriptions = td
  return out
}

export function Step2Compile() {
  const { index, nav, setNav } = useRun()
  const run = index.run
  const selected = nav.astNode
  const [showAllJson, setShowAllJson] = useState(false)

  const pragmaRanges = useMemo<Highlight[]>(() => {
    const out: Highlight[] = []
    for (const n of childNodes(run.ast)) {
      if (n.nodeType === 'PragmaDirective')
        out.push({ ...index.rangeOfNode(n), kind: 'secondary' })
    }
    return out
  }, [run.ast, index])

  const highlights: Highlight[] = selected
    ? [{ ...index.rangeOfNode(selected), kind: 'primary' }]
    : pragmaRanges

  const select = (node: AstNode) => {
    const range = index.rangeOfNode(node)
    setNav({
      astNode: node,
      range,
      line: index.lineOf(range.start),
      nonce: nav.nonce + 1,
    })
  }

  const factsHere = selected
    ? ((typeof selected.id === 'number'
        ? index.rowsByNodeId.get(selected.id)
        : index.rowsBySrc.get(selected.src)) ?? [])
    : []
  const factsByRelation = new Map<string, number>()
  for (const r of factsHere)
    factsByRelation.set(r.relation, (factsByRelation.get(r.relation) ?? 0) + 1)

  const resolvedFromText: Record<string, string> = {
    cache:
      'a binary already in the local cache satisfied the pragma (no download)',
    'release-list':
      'looked up binaries.soliditylang.org/list.json and downloaded the newest matching release, verifying its sha256',
    override: 'a version was forced on the command line',
    'bundled-solcjs': 'the solc-js (wasm) build bundled in node_modules',
  }

  return (
    <div className="step split">
      <div className="pane">
        <div className="pane-head">
          <h3>Source · click any word to find its node</h3>
          {selected && (
            <button
              type="button"
              className="btn small"
              onClick={() => setNav({ astNode: undefined, range: undefined })}
            >
              clear selection
            </button>
          )}
        </div>
        <SourceView
          text={run.source}
          lang="solidity"
          highlights={highlights}
          scrollTo={nav.line ? { line: nav.line, nonce: nav.nonce } : undefined}
          onOffsetClick={(offset) => {
            const node = index.deepestNodeAt(offset)
            if (node) select(node)
          }}
        />
      </div>
      <div className="pane stack">
        <div className="intro" style={{ marginBottom: 0 }}>
          <h2>⚙️ Step 2 · Let the compiler read it</h2>
          <p className="lead">
            We never parse Solidity ourselves. The compiler already resolves
            every name, type and scope, so we ask it for its two relevant
            outputs: the <b>abstract syntax tree</b> (its structured reading of
            the text) and the <b>storage layout</b> (which variable lives in
            which slot). This is the same standard-JSON interface block
            explorers use to verify contracts.
          </p>
        </div>

        <Panel title="1 · Which compiler">
          <div className="stats">
            <Stat
              value={run.compile.constraints.map((c) => (
                <code key={c}>{c}</code>
              ))}
              label="pragma constraint(s) found in the file"
            />
            <Stat
              value={<code>{run.compile.solcVersion}</code>}
              label="solc release chosen"
            />
            <Stat value={ms(run.timings.resolveMs)} label="resolve" />
            <Stat value={ms(run.timings.compileMs)} label="compile" />
            <Stat value={run.compile.warnings} label="warnings" />
          </div>
          <p className="small muted" style={{ marginTop: 8 }}>
            Resolution:{' '}
            {resolvedFromText[run.compile.resolvedFrom] ??
              run.compile.resolvedFrom}
            . Pragma lines are highlighted in the source.
          </p>
          {run.compile.diagnostics.length > 0 && (
            <details className="more">
              <summary>
                {run.compile.diagnostics.length} compiler message(s)
              </summary>
              {run.compile.diagnostics.map((d, i) => (
                <pre key={i} className="tsv">
                  {d.formattedMessage ?? d.message}
                </pre>
              ))}
            </details>
          )}
        </Panel>

        <Panel title="2 · What we asked for (solc-input.json)">
          <p className="small muted">
            <code>outputSelection</code> is the whole trick: <code>""</code> →{' '}
            <code>ast</code> asks for the tree of the file; <code>"*"</code> →{' '}
            <code>storageLayout</code> asks for every contract's slot map. The
            optimizer is off because we never look at bytecode.
          </p>
          <JsonView value={run.compile.input} depth={4} />
        </Panel>

        <Panel
          title="3 · What came back: the AST"
          actions={
            <span className="small muted">
              {index.nodesById.size} nodes · click a node, or a word in the
              source
            </span>
          }
        >
          <p className="small muted">
            Every node has a <code>nodeType</code>, an <code>id</code>, and a{' '}
            <code>src</code> of the form <code>byteOffset:length:file</code>{' '}
            pointing back into the text. Identifiers carry{' '}
            <code>referencedDeclaration</code>: the id of the thing they name.
            That single field is what makes name resolution free for us. Fields
            the extractor reads are <span className="used">tinted</span>.
          </p>
          <div className="grid-2" style={{ alignItems: 'start' }}>
            <div style={{ maxHeight: 520, overflow: 'auto' }}>
              <AstTree selected={selected} onSelect={select} />
            </div>
            <div style={{ maxHeight: 520, overflow: 'auto' }}>
              {selected ? (
                <>
                  <div className="row" style={{ marginBottom: 6 }}>
                    <b className="mono">
                      {selected.nodeType} {nodeLabel(selected)}
                    </b>
                    <span className="muted small">
                      lines {index.lineOf(index.rangeOfNode(selected).start)}–
                      {index.lineOf(
                        Math.max(index.rangeOfNode(selected).end - 1, 0),
                      )}
                    </span>
                    <button
                      type="button"
                      className="btn small"
                      onClick={() => setShowAllJson(!showAllJson)}
                    >
                      {showAllJson
                        ? 'own fields only'
                        : 'full JSON incl. children'}
                    </button>
                  </div>
                  {factsHere.length > 0 ? (
                    <Callout kind="ok">
                      <b>{factsHere.length} fact rows</b> were emitted while the
                      extractor stood on this node:{' '}
                      {[...factsByRelation.entries()].map(([r, n]) => (
                        <span key={r}>
                          <code>{r}</code>×{n}{' '}
                        </span>
                      ))}
                      <button
                        type="button"
                        className="btn link"
                        onClick={() =>
                          setNav({
                            step: 3,
                            filterNodeId:
                              typeof selected.id === 'number'
                                ? selected.id
                                : undefined,
                            filterLine:
                              typeof selected.id === 'number'
                                ? undefined
                                : index.lineOf(
                                    index.rangeOfNode(selected).start,
                                  ),
                            relation: undefined,
                            factRef: undefined,
                          })
                        }
                      >
                        see them in step 3 →
                      </button>
                    </Callout>
                  ) : (
                    <Callout kind="plain">
                      No fact row was emitted <i>from this node itself</i>; its
                      children or parent may carry the information (e.g. a
                      Block's statements, an Identifier's enclosing assignment).
                    </Callout>
                  )}
                  <JsonView
                    value={showAllJson ? selected : ownFields(selected)}
                    depth={showAllJson ? 2 : 1}
                    markUsed
                  />
                </>
              ) : (
                <Callout kind="plain">
                  Select a node on the left, or click a word in the source, to
                  see the JSON solc produced for it and which facts were derived
                  from it.
                </Callout>
              )}
            </div>
          </div>
        </Panel>

        <Panel title="4 · … and the storage layout">
          <p className="small muted">
            Per contract, the compiler's assignment of state variables to
            32-byte slots (constants and immutables have no slot). The extractor
            copies this into the <code>storageSlot</code> relation, matching
            entries to declarations through <code>astId</code>.
          </p>
          {run.storageLayout.length === 0 && (
            <p className="muted">No contract with storage in this file.</p>
          )}
          {run.storageLayout.map((layout) => (
            <div key={layout.contract} style={{ marginBottom: 10 }}>
              <b className="mono">{layout.contract}</b>
              {layout.storage.length === 0 ? (
                <p className="muted small">no storage variables</p>
              ) : (
                <table className="plain">
                  <thead>
                    <tr>
                      <th>slot</th>
                      <th>offset</th>
                      <th>variable</th>
                      <th>type</th>
                      <th>bytes</th>
                      <th>astId</th>
                    </tr>
                  </thead>
                  <tbody>
                    {layout.storage.map((s) => (
                      <tr key={`${s.slot}-${s.offset}-${s.label}`}>
                        <td className="mono">{s.slot}</td>
                        <td className="mono">{s.offset}</td>
                        <td>
                          <button
                            type="button"
                            className="btn link mono"
                            onClick={() => {
                              const node = index.nodesById.get(s.astId)
                              if (node) select(node)
                            }}
                          >
                            {s.label}
                          </button>
                        </td>
                        <td className="mono">
                          {layout.types[s.type]?.label ?? s.type}
                        </td>
                        <td className="mono">
                          {layout.types[s.type]?.numberOfBytes ?? ''}
                        </td>
                        <td className="mono muted">#{s.astId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </Panel>

        <Callout kind="plain">
          <b>Where this lives on disk:</b>{' '}
          <code>{run.runDir}/solc-input.json</code> and{' '}
          <code>{run.runDir}/solc-output.json</code>.
        </Callout>
      </div>
    </div>
  )
}
