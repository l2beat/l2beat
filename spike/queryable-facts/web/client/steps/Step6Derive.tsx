import { useState } from 'react'
import type { ExplainResult } from '../../shared/types'
import { api } from '../api'
import { DatalogView } from '../components/DatalogView'
import { FactsTable } from '../components/FactsTable'
import { ProofTree } from '../components/ProofTree'
import { type Highlight, SourceView } from '../components/SourceView'
import { Callout, ms, Panel } from '../components/ui'
import { useRun } from '../lib/context'

const HEADLINE = ['storageWriters', 'writeClaims', 'opaqueWrites', 'writes']

export function Step6Derive() {
  const { index, nav, setNav } = useRun()
  const run = index.run
  const relation = nav.derivedRelation ?? 'writeClaims'
  const info = index.relations.get(relation)
  const rows = index.derived.get(relation) ?? []
  const [proof, setProof] = useState<
    | { row: number; result?: ExplainResult; error?: string; loading: boolean }
    | undefined
  >()
  const [showSource, setShowSource] = useState(true)
  const [hoverRow, setHoverRow] = useState<number | undefined>()

  const groups = derivedGroups(index)
  const clauses = run.program.items.filter(
    (i) => i.kind === 'clause' && i.head === relation,
  )

  const highlights: Highlight[] = []
  if (nav.range) highlights.push({ ...nav.range, kind: 'primary' })
  const hovered = hoverRow !== undefined ? rows[hoverRow] : undefined
  if (hovered) {
    for (const c of hovered) {
      // whole-contract ranges would flood the pane; functions, variables and sites are what matter
      if (index.kindOf(c) === 'contract') continue
      const r = index.rangeOfId(c)
      if (r) highlights.push({ ...r, kind: 'secondary' })
    }
  }

  const explain = (row: number) => {
    const cols = rows[row]
    if (!cols) return
    setProof({ row, loading: true })
    api
      .explain({ runId: run.runId, relation, cols })
      .then((result) => setProof({ row, result, loading: false }))
      .catch((e: unknown) =>
        setProof({
          row,
          error: e instanceof Error ? e.message : String(e),
          loading: false,
        }),
      )
  }

  const ruleCount = run.program.items.filter((i) => i.kind === 'clause').length

  return (
    <div
      className="step split"
      style={{
        gridTemplateColumns: showSource
          ? '230px 1fr minmax(320px, 34%)'
          : '230px 1fr',
      }}
    >
      <div className="pane">
        <div className="pane-head">
          <h3>Derived relations</h3>
        </div>
        <div className="side-list">
          <div className="g">Headline results</div>
          {HEADLINE.map((name) => (
            <RelButton
              key={name}
              name={name}
              active={relation === name}
              count={index.derived.get(name)?.length ?? 0}
              onClick={() => {
                setNav({ derivedRelation: name })
                setProof(undefined)
              }}
            />
          ))}
          {groups.map(([section, names]) => (
            <div key={section}>
              <div className="g">{section.split(':')[0]}</div>
              {names.map((name) => (
                <RelButton
                  key={name}
                  name={name}
                  active={relation === name}
                  count={index.derived.get(name)?.length ?? 0}
                  onClick={() => {
                    setNav({ derivedRelation: name })
                    setProof(undefined)
                  }}
                />
              ))}
            </div>
          ))}
          <div className="g">Layer 1</div>
          <button
            type="button"
            className="rel"
            onClick={() => setNav({ step: 4 })}
          >
            <span>concepts → step 4</span>
            <span className="c">{index.conceptCount}</span>
          </button>
        </div>
      </div>

      <div className="pane stack">
        <div className="intro" style={{ marginBottom: 0 }}>
          <h2>🔁 Step 6 · Let Soufflé derive everything that follows</h2>
          <p className="lead">
            Soufflé read <b>{index.baseCount}</b> base rows, applied the{' '}
            <b>{ruleCount}</b> rules of layers 1–5 to a fixpoint and derived{' '}
            <b>{index.conceptCount}</b> concept rows plus{' '}
            <b>{index.derivedCount}</b> analysis tuples across{' '}
            {run.derived.filter((d) => d.rows.length > 0).length} relations in{' '}
            <b>{ms(run.timings.souffleMs)}</b> (interpreter mode, including
            start-up). This is the one and only model of the program: a tuple is
            here if and only if some chain of rules produces it from the facts.
            Press <b>why?</b> on any tuple to see that chain — all the way down
            through the concepts of step 4 to the raw rows of step 3.
          </p>
          <div className="row small muted">
            <code>
              {run.souffle.command.replace(/\/\S*\/(out\/runs\/[^/]+)/g, '$1')}
            </code>
            <span>· Soufflé {run.souffle.version}</span>
            <span style={{ flex: 1 }} />
            <button
              type="button"
              className="btn small"
              onClick={() => setShowSource(!showSource)}
            >
              {showSource ? 'hide source' : 'show source'}
            </button>
          </div>
          {run.souffle.stderr && (
            <pre className="tsv small">{run.souffle.stderr}</pre>
          )}
        </div>

        <Panel
          title={
            <span className="mono">
              {relation}({info?.columns.map((c) => c.name).join(', ')})
            </span>
          }
          actions={
            <>
              {info?.isOutput && <span className="tag output">.output</span>}
              <span className="muted small">{rows.length} tuples</span>
              <button
                type="button"
                className="btn small"
                onClick={() => setNav({ step: 5, focusRelation: relation })}
              >
                rules →
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
            <details className="more">
              <summary>
                the {clauses.length} rule{clauses.length === 1 ? '' : 's'} that
                define it
              </summary>
              {clauses.map((c) => (
                <div key={c.line} style={{ margin: '6px 0' }}>
                  {c.kind === 'clause' && c.comment && (
                    <div
                      className="muted small"
                      style={{ fontStyle: 'italic' }}
                    >
                      {c.comment}
                    </div>
                  )}
                  <DatalogView
                    text={c.kind === 'clause' ? c.text : ''}
                    firstLine={c.line}
                    onRelationClick={(name) => {
                      if (index.concepts.has(name))
                        setNav({ step: 4, relation: name })
                      else if (index.base.has(name))
                        setNav({ step: 3, baseRelation: name })
                      else setNav({ step: 5, focusRelation: name })
                    }}
                  />
                </div>
              ))}
            </details>
          </div>
          <div style={{ maxHeight: proof ? 300 : 620, overflow: 'auto' }}>
            <FactsTable
              columns={info?.columns ?? []}
              rows={rows}
              selected={proof?.row}
              onHover={setHoverRow}
              extraHeader=""
              extra={(i) => (
                <button
                  type="button"
                  className="btn small"
                  onClick={() => explain(i)}
                  disabled={proof?.loading && proof.row === i}
                >
                  {proof?.loading && proof.row === i ? (
                    <span className="spinner" />
                  ) : (
                    'why?'
                  )}
                </button>
              )}
            />
          </div>
        </Panel>

        {proof && (
          <Panel
            title={
              <span>
                Why does this tuple hold?{' '}
                {proof.result && (
                  <span className="muted small">
                    (Soufflé answered in {ms(proof.result.ms)})
                  </span>
                )}
              </span>
            }
            actions={
              <button
                type="button"
                className="btn small"
                onClick={() => setProof(undefined)}
              >
                ✕ close
              </button>
            }
          >
            {proof.loading && (
              <p className="muted">
                <span className="spinner" /> re-running Soufflé with provenance
                tracking…
              </p>
            )}
            {proof.error && <div className="err">{proof.error}</div>}
            {proof.result && (
              <>
                <p className="small muted">
                  Read top-down: each <b>↳</b> tuple was produced by the rule
                  shown, from the tuples indented under it; rows tagged{' '}
                  <span className="tag concept">concept</span> come from step 4;{' '}
                  <b>●</b> leaves are base rows from step 3 (with the source
                  line of the node they describe); <b>∄</b> marks a negated atom
                  the rule checked was absent.
                </p>
                <div className="proof">
                  <ProofTree node={proof.result.proof} />
                </div>
              </>
            )}
          </Panel>
        )}

        <Callout kind="plain">
          <b>Where this lives on disk:</b>{' '}
          <code>{run.runDir}/derived/&lt;relation&gt;.csv</code>; the report
          rendered from them is <code>{run.runDir}/report.md</code> (next step,
          next iteration).
        </Callout>
      </div>

      {showSource && (
        <div className="pane">
          <div className="pane-head">
            <h3>Source · hover a tuple to light up its ids</h3>
          </div>
          <SourceView
            text={run.source}
            lang="solidity"
            highlights={highlights}
            scrollTo={
              nav.line ? { line: nav.line, nonce: nav.nonce } : undefined
            }
          />
        </div>
      )}
    </div>
  )
}

function RelButton({
  name,
  active,
  count,
  onClick,
}: {
  name: string
  active: boolean
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`rel ${active ? 'active' : ''} ${count === 0 ? 'empty' : ''}`}
      onClick={onClick}
    >
      <span>{name}</span>
      <span className="c">{count}</span>
    </button>
  )
}

/** Analysis relations (lib.dl / report.dl) grouped by the section they are declared in. */
function derivedGroups(
  index: ReturnType<typeof useRun>['index'],
): Array<[string, string[]]> {
  const groups = new Map<string, string[]>()
  for (const r of index.run.program.relations) {
    if (r.isInput || r.file === 'concepts.dl') continue
    const list = groups.get(r.section) ?? []
    list.push(r.name)
    groups.set(r.section, list)
  }
  return [...groups.entries()]
}
