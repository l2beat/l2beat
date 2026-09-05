import { useMemo, useState } from 'react'
import { FactsTable } from '../components/FactsTable'
import { NodeChip } from '../components/IdChip'
import { JsonView } from '../components/JsonView'
import { type Highlight, SourceView } from '../components/SourceView'
import { Callout, kib, ms, Panel } from '../components/ui'
import { useRun } from '../lib/context'
import type { RowRef } from '../lib/run'
import { ownFields } from './Step2Compile'

/** The encoding, as a table: which JSON shape becomes which relation. */
const ENCODING: Array<[string, string, string]> = [
  ['an object with nodeType', 'node(Id, Type)', 'one row per AST node'],
  ['…its src', 'loc(Id, Src, Start, Len, Line, EndLine)', 'decoded into bytes and lines'],
  ['…the text under it', 'text(Id, Text)', 'one line, cut at 200 chars (display only)'],
  ['a field holding a node', 'child(Parent, Field, Index, Child)', 'the tree edges'],
  ['a string or boolean field', 'attr(Id, Key, Value)', 'name, operator, visibility, kind, …'],
  ['a number field', 'num(Id, Key, Value)', 'referencedDeclaration, scope, …'],
  ['strings inside an array', 'attrList(Id, Key, Index, Value)', 'e.g. names of named arguments'],
  ['numbers inside an array', 'numList(Id, Key, Index, Value)', 'e.g. linearizedBaseContracts'],
  ['solc’s storage layout', 'storageLayout(Contract, AstId, Label, Slot, Offset, Type)', 'copied verbatim'],
  ['the run itself', 'unit(Unit, File, Solc)', 'id prefix, file, compiler version'],
]

const BASE_ORDER = [
  'node',
  'loc',
  'text',
  'child',
  'attr',
  'num',
  'attrList',
  'numList',
  'storageLayout',
  'unit',
]

export function Step3Facts() {
  const { index, nav, setNav, showRange } = useRun()
  const run = index.run
  const [hoverLine, setHoverLine] = useState<number | undefined>()
  const [hoverRow, setHoverRow] = useState<RowRef | undefined>()
  const [raw, setRaw] = useState(false)
  const relation = nav.baseRelation ?? 'node'
  const info = index.relations.get(relation)
  const rows = index.base.get(relation) ?? []

  const badges = useMemo(() => {
    const m = new Map<number, number>()
    for (const [line, refs] of index.baseRowsByLine) m.set(line, refs.length)
    return m
  }, [index])

  const nodeId = nav.baseNodeId
  const node = nodeId === undefined ? undefined : index.nodeOfNumId(nodeId)
  const nodeRows = nodeId === undefined ? [] : (index.baseRowsByNode.get(nodeId) ?? [])
  const nodeRange = nodeId === undefined ? undefined : index.rangeOfNodeId(nodeId)
  const conceptsHere =
    nodeId === undefined ? [] : (index.conceptRowsByNode.get(nodeId) ?? [])

  // Nodes that start on the badge-clicked line.
  const lineNodes = useMemo(() => {
    if (nav.baseLine === undefined) return []
    const ids = new Set<number>()
    for (const ref of index.baseRowsByLine.get(nav.baseLine) ?? []) {
      const id = index.anchorNodeId(ref)
      if (id !== undefined) ids.add(id)
    }
    return [...ids].sort((a, b) => {
      const la = index.locOfNode.get(a)
      const lb = index.locOfNode.get(b)
      return (la?.start ?? 0) - (lb?.start ?? 0) || (lb?.length ?? 0) - (la?.length ?? 0)
    })
  }, [index, nav.baseLine])

  const hoverRange = hoverRow ? index.rangeOfRow(hoverRow) : undefined
  const highlights: Highlight[] = []
  if (nodeRange) highlights.push({ ...nodeRange, kind: 'primary' })
  else if (nav.range) highlights.push({ ...nav.range, kind: 'primary' })
  if (hoverRange) highlights.push({ ...hoverRange, kind: 'secondary' })

  const selectNode = (id: number) => {
    const range = index.rangeOfNodeId(id)
    setNav({
      baseNodeId: id,
      baseLine: undefined,
      range,
      line: range ? index.lineOf(range.start) : undefined,
      nonce: nav.nonce + 1,
    })
  }

  const bytes = run.facts.reduce(
    (n, f) => n + f.rows.reduce((m, r) => m + r.join('\t').length + 1, 0),
    0,
  )

  return (
    <div className="step split">
      <div className="pane">
        <div className="pane-head">
          <h3>
            Source · badge = rows about nodes that start on this line · click a
            word to pick its node
          </h3>
        </div>
        <SourceView
          text={run.source}
          lang="solidity"
          highlights={highlights}
          badges={badges}
          activeLine={hoverLine ?? nav.baseLine}
          scrollTo={nav.line ? { line: nav.line, nonce: nav.nonce } : undefined}
          onLineEnter={setHoverLine}
          onLineLeave={() => setHoverLine(undefined)}
          onBadgeClick={(line) =>
            setNav({ baseLine: line, baseNodeId: undefined, range: undefined })
          }
          onOffsetClick={(offset) => {
            const n = index.deepestNodeAt(offset)
            const id = n ? index.numIdOf(n) : undefined
            if (id !== undefined) selectNode(id)
          }}
        />
      </div>
      <div className="pane stack">
        <div className="intro" style={{ marginBottom: 0 }}>
          <h2>🧱 Step 3 · Write the tree down as facts, and nothing else</h2>
          <p className="lead">
            Layer 0 is the compiler's answer re-encoded as rows, mechanically.
            The emitter (<code>src/emit.ts</code>) has no idea what a function
            or an assignment is: it walks the JSON and applies one rule per JSON
            shape — an object becomes a <code>node</code> row, a field that
            holds another object becomes a <code>child</code> edge, a string
            field becomes an <code>attr</code>, a number a <code>num</code>.
            Nothing is selected, summarised or interpreted, so there is nothing
            here to argue about: every row is something solc said. The meaning
            (this node is a <i>write to that variable</i>) comes in the next
            step, as rules you can read.
          </p>
          <div className="stats">
            <span className="stat">
              <span className="v">{index.baseCount}</span>
              <span className="l">rows</span>
            </span>
            <span className="stat">
              <span className="v">{index.base.get('node')?.length ?? 0}</span>
              <span className="l">AST nodes</span>
            </span>
            <span className="stat">
              <span className="v">{run.syntheticIds}</span>
              <span className="l">Yul nodes given ids</span>
            </span>
            <span className="stat">
              <span className="v">{kib(bytes)}</span>
              <span className="l">of TSV</span>
            </span>
            <span className="stat">
              <span className="v">{ms(run.timings.emitMs)}</span>
              <span className="l">to emit</span>
            </span>
          </div>
        </div>

        <Panel title="The encoding · one rule per JSON shape" tight>
          <div className="panel-body">
            <table className="plain">
              <tbody>
                {ENCODING.map(([shape, rel, note]) => (
                  <tr key={rel}>
                    <td className="small">{shape}</td>
                    <td className="mono small">→ {rel}</td>
                    <td className="small muted">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small muted" style={{ marginTop: 6 }}>
              Nested plain objects flatten into dotted keys (
              <code>typeDescriptions.typeString</code>); Yul nodes, which solc
              leaves without an id, get synthetic ids above the largest one.
              The full declaration with comments is <code>rules/schema.dl</code>
              .
            </p>
          </div>
        </Panel>

        {nav.baseLine !== undefined && node === undefined && (
          <Panel
            title={`Nodes that start on line ${nav.baseLine}`}
            actions={
              <button
                type="button"
                className="btn small"
                onClick={() => setNav({ baseLine: undefined })}
              >
                ✕
              </button>
            }
          >
            <p className="small muted">
              Outermost first. Pick one to see every row that describes it.
            </p>
            <div className="row" style={{ flexWrap: 'wrap' }}>
              {lineNodes.map((id) => (
                <NodeChip key={id} id={id} onClick={selectNode} />
              ))}
            </div>
          </Panel>
        )}

        {node && nodeId !== undefined && (
          <Panel
            title={
              <span>
                One node, all its rows ·{' '}
                <span className="mono">
                  {node.nodeType} #{nodeId}
                </span>
                <span className="muted small">
                  {' '}
                  · lines {index.locOfNode.get(nodeId)?.startLine}–
                  {index.locOfNode.get(nodeId)?.endLine}
                </span>
              </span>
            }
            actions={
              <>
                <button
                  type="button"
                  className="btn small"
                  onClick={() =>
                    setNav({
                      step: 2,
                      astNode: node,
                      range: nodeRange,
                      line: nodeRange ? index.lineOf(nodeRange.start) : undefined,
                      nonce: nav.nonce + 1,
                    })
                  }
                >
                  in the AST (step 2)
                </button>
                <button
                  type="button"
                  className={`btn small ${conceptsHere.length === 0 ? 'muted' : ''}`}
                  onClick={() =>
                    setNav({
                      step: 4,
                      filterNodeId: nodeId,
                      filterLine: undefined,
                      relation: undefined,
                      factRef: undefined,
                    })
                  }
                >
                  {conceptsHere.length} concept
                  {conceptsHere.length === 1 ? '' : 's'} derived here → step 4
                </button>
                <button
                  type="button"
                  className="btn small"
                  onClick={() =>
                    setNav({ baseNodeId: undefined, range: undefined })
                  }
                >
                  ✕
                </button>
              </>
            }
          >
            <div className="grid-2">
              <div>
                <p className="small muted" style={{ marginTop: 0 }}>
                  What solc wrote (own fields, children collapsed):
                </p>
                <JsonView value={ownFields(node)} depth={1} />
              </div>
              <div>
                <p className="small muted" style={{ marginTop: 0 }}>
                  What the emitter wrote down ({nodeRows.length} rows):
                </p>
                {BASE_ORDER.filter((rel) =>
                  nodeRows.some((r) => r.relation === rel),
                ).map((rel) => {
                  const refs = nodeRows.filter((r) => r.relation === rel)
                  return (
                    <div key={rel} style={{ marginBottom: 8 }}>
                      <div className="row" style={{ marginBottom: 2 }}>
                        <b className="mono small">{rel}</b>
                        {rel === 'child' && (
                          <span className="muted small">
                            (as parent and as child)
                          </span>
                        )}
                      </div>
                      <FactsTable
                        columns={index.relations.get(rel)?.columns ?? []}
                        rows={refs.map((r) => index.row(r) ?? [])}
                        onHover={(i) =>
                          setHoverRow(i === undefined ? undefined : refs[i])
                        }
                        onNodeClick={selectNode}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </Panel>
        )}

        <div className="rel-groups">
          <div className="rel-group">
            <div className="g">Base relations · rules/schema.dl</div>
            <div className="rel-list">
              {BASE_ORDER.map((name) => {
                const n = index.base.get(name)?.length ?? 0
                return (
                  <button
                    type="button"
                    key={name}
                    className={`rel ${relation === name ? 'active' : ''} ${n === 0 ? 'empty' : ''}`}
                    onClick={() => setNav({ baseRelation: name })}
                  >
                    {name}
                    <span className="c">{n}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <Panel
          title={
            <span className="mono">
              {relation}({info?.columns.map((c) => c.name).join(', ')})
            </span>
          }
          actions={
            <>
              <span className="muted small">{rows.length} rows</span>
              <button
                type="button"
                className="btn small"
                onClick={() => setRaw(!raw)}
              >
                {raw ? 'table' : `raw ${relation}.facts`}
              </button>
            </>
          }
          tight
        >
          <div className="panel-body" style={{ paddingBottom: 0 }}>
            {info?.comment && (
              <p className="small" style={{ color: '#3a3f47' }}>
                {info.comment}
              </p>
            )}
            <p className="small muted">
              Hover a row to see the node it is about; click a node chip to pin
              that node and list all its rows.
            </p>
          </div>
          {raw ? (
            <pre className="tsv">
              {rows
                .slice(0, 400)
                .map((r) => r.join('\t'))
                .join('\n') || '(empty file)'}
              {rows.length > 400 ? `\n… ${rows.length - 400} more rows` : ''}
            </pre>
          ) : (
            <div style={{ maxHeight: 460, overflow: 'auto' }}>
              <FactsTable
                columns={info?.columns ?? []}
                rows={rows}
                onHover={(i) =>
                  setHoverRow(i === undefined ? undefined : { relation, index: i })
                }
                onSelect={(i) => {
                  const id = index.anchorNodeId({ relation, index: i })
                  if (id !== undefined) selectNode(id)
                  else showRange(undefined)
                }}
                onNodeClick={selectNode}
              />
            </div>
          )}
        </Panel>

        <Callout kind="plain">
          <b>Where this lives on disk:</b>{' '}
          <code>{run.runDir}/facts/&lt;relation&gt;.facts</code> — exactly the
          files Soufflé reads with <code>.input</code>. There is no separate
          provenance file any more: a row's origin is the node id in its first
          column.
        </Callout>
      </div>
    </div>
  )
}
