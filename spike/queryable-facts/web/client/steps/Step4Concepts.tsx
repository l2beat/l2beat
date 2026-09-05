import { useEffect, useMemo, useState } from 'react'
import type { ExplainResult } from '../../shared/types'
import { api } from '../api'
import { DatalogView } from '../components/DatalogView'
import { FactsTable } from '../components/FactsTable'
import { IdChip } from '../components/IdChip'
import { ProofTree } from '../components/ProofTree'
import { buildCards, RuleCards } from '../components/RuleCards'
import { type Highlight, SourceView } from '../components/SourceView'
import { Callout, ms, Panel } from '../components/ui'
import { useRun } from '../lib/context'
import type { RowRef } from '../lib/run'

/** The concept relations grouped the way a reader thinks about a contract. */
export const CONCEPT_GROUPS: Array<[string, string[]]> = [
  ['Structure', ['codeUnit', 'contract', 'inherits', 'usingFor', 'event']],
  ['Functions', ['function', 'overrides', 'param', 'localVar', 'functionBody']],
  ['State', ['stateVariable', 'initializer', 'storageSlot']],
  ['Statements & conditions', ['stmt', 'condition', 'condShape', 'refs']],
  [
    'Writes & references',
    ['writeSite', 'readsDirect', 'refBinding', 'returnsRef', 'callResult'],
  ],
  ['Calls', ['callSite', 'argBinding']],
  [
    'Inline assembly',
    ['assembly', 'asmExtRef', 'asmSstore', 'asmLet', 'asmCall'],
  ],
  ['Bookkeeping', ['sourceLoc', 'located', 'unhandled']],
]

export function Step4Concepts() {
  const { index, nav, setNav, showRange } = useRun()
  const run = index.run
  const [hoverLine, setHoverLine] = useState<number | undefined>()
  const [hoverRow, setHoverRow] = useState<RowRef | undefined>()
  const [raw, setRaw] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [proof, setProof] = useState<
    | { ref: RowRef; result?: ExplainResult; error?: string; loading: boolean }
    | undefined
  >()
  const relation = nav.relation ?? 'writeSite'
  const info = index.relations.get(relation)
  const rows = index.concepts.get(relation) ?? []

  const badges = useMemo(() => {
    const m = new Map<number, number>()
    for (const [line, refs] of index.conceptRowsByLine) m.set(line, refs.length)
    return m
  }, [index])

  const conceptSections = useMemo(
    () =>
      buildCards(run.program.items).filter(
        (s) => s.file === 'concepts.dl' && s.cards.length > 0,
      ),
    [run.program.items],
  )
  const conceptRuleCount = run.program.items.filter(
    (i) => i.kind === 'clause' && i.file === 'concepts.dl',
  ).length
  const publicRelations = CONCEPT_GROUPS.flatMap(([, names]) => names)
  const helperRelations = [...index.concepts.keys()].filter(
    (n) => !publicRelations.includes(n),
  )

  // Filtered view: concept rows anchored at one node or starting on one line.
  const filtered: RowRef[] | undefined =
    nav.filterNodeId !== undefined
      ? (index.conceptRowsByNode.get(nav.filterNodeId) ?? [])
      : nav.filterLine !== undefined
        ? (index.conceptRowsByLine.get(nav.filterLine) ?? [])
        : undefined
  const filterLabel =
    nav.filterNodeId !== undefined
      ? `concepts anchored at AST node #${nav.filterNodeId} (${index.nodeOfNumId(nav.filterNodeId)?.nodeType ?? '?'})`
      : nav.filterLine !== undefined
        ? `concepts anchored on line ${nav.filterLine}`
        : undefined

  const pinned = nav.factRef
  const pinnedRow = pinned ? index.row(pinned) : undefined
  const pinnedRange = pinned ? index.rangeOfRow(pinned) : undefined
  const pinnedNodeId = pinned ? index.anchorNodeId(pinned) : undefined
  const hoverRange = hoverRow ? index.rangeOfRow(hoverRow) : undefined
  const highlights: Highlight[] = []
  if (pinnedRange) highlights.push({ ...pinnedRange, kind: 'primary' })
  else if (nav.range) highlights.push({ ...nav.range, kind: 'primary' })
  if (hoverRange) highlights.push({ ...hoverRange, kind: 'secondary' })
  if (hoverRow && !hoverRange) {
    for (const c of index.row(hoverRow) ?? []) {
      if (index.kindOf(c) === 'contract') continue
      const r = index.rangeOfId(c)
      if (r) highlights.push({ ...r, kind: 'secondary' })
    }
  }

  const selectRow = (ref: RowRef) => {
    const range = index.rangeOfRow(ref)
    setNav({
      factRef: ref,
      range,
      line: range ? index.lineOf(range.start) : undefined,
      nonce: nav.nonce + 1,
    })
  }

  // Ask Soufflé why the pinned row holds, as soon as it is pinned.
  useEffect(() => {
    if (!pinned) {
      setProof(undefined)
      return
    }
    const cols = index.row(pinned)
    if (!cols) return
    setProof({ ref: pinned, loading: true })
    let cancelled = false
    api
      .explain({ runId: run.runId, relation: pinned.relation, cols })
      .then((result) => {
        if (!cancelled) setProof({ ref: pinned, result, loading: false })
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setProof({
            ref: pinned,
            error: e instanceof Error ? e.message : String(e),
            loading: false,
          })
      })
    return () => {
      cancelled = true
    }
  }, [pinned, index, run.runId])

  useEffect(() => {
    if (!nav.focusRelation || !showRules) return
    document
      .querySelector(`[data-rel="${nav.focusRelation}"]`)
      ?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [nav.focusRelation, showRules])

  const clauses = run.program.items.filter(
    (i) => i.kind === 'clause' && i.head === relation,
  )

  const jump = (name: string) => {
    if (index.base.has(name)) setNav({ step: 3, baseRelation: name })
    else if (index.concepts.has(name)) {
      setShowRules(true)
      setNav({ focusRelation: name })
    } else setNav({ step: 5, focusRelation: name })
  }

  return (
    <div className="step split">
      <div className="pane">
        <div className="pane-head">
          <h3>
            Source · badge = concepts anchored on this line · click a badge to
            list them
          </h3>
        </div>
        <SourceView
          text={run.source}
          lang="solidity"
          highlights={highlights}
          badges={badges}
          activeLine={hoverLine ?? nav.filterLine}
          scrollTo={nav.line ? { line: nav.line, nonce: nav.nonce } : undefined}
          onLineEnter={setHoverLine}
          onLineLeave={() => setHoverLine(undefined)}
          onBadgeClick={(line) =>
            setNav({
              filterLine: line,
              filterNodeId: undefined,
              factRef: undefined,
              range: undefined,
            })
          }
          onLineClick={(line) => {
            if (index.conceptRowsByLine.has(line))
              setNav({
                filterLine: line,
                filterNodeId: undefined,
                factRef: undefined,
                range: undefined,
              })
          }}
        />
      </div>
      <div className="pane stack">
        <div className="intro" style={{ marginBottom: 0 }}>
          <h2>🔎 Step 4 · From syntax to concepts, one rule at a time</h2>
          <p className="lead">
            Layer 1 turns raw rows into the vocabulary an analyst uses: this
            node is a <b>function</b>, that one a <b>statement</b> inside it,
            this <code>Assignment</code> is a <b>write site</b> of that state
            variable, this <code>FunctionCall</code> is an <b>internal call</b>{' '}
            of that function. Until now this step was a TypeScript walker with
            its judgment calls buried in code. Now every concept is a Datalog
            rule in <code>rules/concepts.dl</code>: pin any row below and
            Soufflé shows the rule that produced it and the raw rows from step 3
            it fired on. If a researcher disagrees with what counts as a write,
            the disagreement is about one visible rule.
          </p>
          <div className="stats">
            <span className="stat">
              <span className="v">{index.conceptCount}</span>
              <span className="l">concept rows</span>
            </span>
            <span className="stat">
              <span className="v">
                {publicRelations.filter((n) => (index.concepts.get(n)?.length ?? 0) > 0).length}
                /{publicRelations.length}
              </span>
              <span className="l">concept relations non-empty</span>
            </span>
            <span className="stat">
              <span className="v">{conceptRuleCount}</span>
              <span className="l">rules in this layer</span>
            </span>
            <span className="stat">
              <span className="v">{helperRelations.length}</span>
              <span className="l">helper relations</span>
            </span>
          </div>
        </div>

        <Panel title="How to read an id" tight>
          <div className="panel-body">
            <div className="legend">
              <code>{run.unit}:Owner</code>
              <span>
                a contract: <i>unit</i>:<i>Name</i>
              </span>
              <code>…:Owner.transfer(address)</code>
              <span>
                a function, constructor, modifier: <i>contract</i>.<i>name</i>(
                <i>param types</i>)
              </span>
              <code>…:Owner.owner</code>
              <span>
                a state variable: <i>contract</i>.<i>name</i>
              </span>
              <code>…transfer(address)/to@612</code>
              <span>
                a parameter or local: <i>function</i>/<i>name</i>@
                <i>byte offset</i>
              </span>
              <code>…transfer(address)@640:17</code>
              <span>
                a site (statement, call, write, assembly): <i>function</i>@
                <i>offset</i>:<i>length</i>
              </span>
            </div>
            <p className="small muted" style={{ marginTop: 6 }}>
              Ids are built by the naming rules of this layer from node ids and
              byte offsets (<code>cat</code> in Datalog), so they are readable
              without a lookup table and stable while the text does not move.
              Every id has a <code>sourceLoc</code> row and a{' '}
              <code>located</code> row pointing at its node; chips are clickable.
            </p>
          </div>
        </Panel>

        {filtered ? (
          <Panel
            title={
              <span>
                {filterLabel} · {filtered.length} row(s)
              </span>
            }
            actions={
              <button
                type="button"
                className="btn small"
                onClick={() =>
                  setNav({ filterLine: undefined, filterNodeId: undefined })
                }
              >
                ✕ back to browsing by relation
              </button>
            }
          >
            {filtered.length === 0 && (
              <p className="muted">
                No concept is anchored here. Concepts anchor at the node that
                carries them (the assignment, the call, the declaration), so
                try the line of the construct itself.
              </p>
            )}
            {[...new Set(filtered.map((r) => r.relation))].map((rel) => {
              const refs = filtered.filter((r) => r.relation === rel)
              const cols = index.relations.get(rel)?.columns ?? []
              return (
                <div key={rel} style={{ marginBottom: 12 }}>
                  <div className="row" style={{ marginBottom: 4 }}>
                    <b className="mono">{rel}</b>
                    <span className="muted small">
                      {index.relations.get(rel)?.comment.split('\n')[0]}
                    </span>
                    <button
                      type="button"
                      className="btn link small"
                      onClick={() =>
                        setNav({
                          relation: rel,
                          filterLine: undefined,
                          filterNodeId: undefined,
                        })
                      }
                    >
                      all {index.concepts.get(rel)?.length ?? 0} rows →
                    </button>
                  </div>
                  <FactsTable
                    columns={cols}
                    rows={refs.map((r) => index.row(r) ?? [])}
                    selected={refs.findIndex(
                      (r) =>
                        pinned &&
                        r.relation === pinned.relation &&
                        r.index === pinned.index,
                    )}
                    onHover={(i) =>
                      setHoverRow(i === undefined ? undefined : refs[i])
                    }
                    onSelect={(i) => {
                      const ref = refs[i]
                      if (ref) selectRow(ref)
                    }}
                  />
                </div>
              )
            })}
          </Panel>
        ) : (
          <>
            <div className="rel-groups">
              {CONCEPT_GROUPS.map(([group, names]) => (
                <div className="rel-group" key={group}>
                  <div className="g">{group}</div>
                  <div className="rel-list">
                    {names.map((name) => {
                      const n = index.concepts.get(name)?.length ?? 0
                      return (
                        <button
                          type="button"
                          key={name}
                          className={`rel ${relation === name ? 'active' : ''} ${n === 0 ? 'empty' : ''}`}
                          onClick={() =>
                            setNav({
                              relation: name,
                              factRef: undefined,
                              range: undefined,
                            })
                          }
                        >
                          {name}
                          <span className="c">{n}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
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
                    onClick={() => {
                      setShowRules(true)
                      setNav({ focusRelation: relation })
                    }}
                  >
                    its {clauses.length} rule{clauses.length === 1 ? '' : 's'} ↓
                  </button>
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => setRaw(!raw)}
                  >
                    {raw ? 'table' : `raw ${relation}.csv`}
                  </button>
                </>
              }
              tight
            >
              <div className="panel-body" style={{ paddingBottom: 0 }}>
                {info?.comment ? (
                  <p className="small" style={{ color: '#3a3f47' }}>
                    {info.comment}
                  </p>
                ) : (
                  <p className="small muted">
                    (no comment in concepts.dl for this relation)
                  </p>
                )}
                <p className="small muted">
                  Hover a row to see the construct it is about; click to pin it
                  and ask Soufflé why it holds.
                </p>
              </div>
              {raw ? (
                <pre className="tsv">
                  {rows.map((r) => r.join('\t')).join('\n') || '(empty)'}
                </pre>
              ) : (
                <div style={{ maxHeight: 460, overflow: 'auto' }}>
                  <FactsTable
                    columns={info?.columns ?? []}
                    rows={rows}
                    selected={
                      pinned?.relation === relation ? pinned.index : undefined
                    }
                    onHover={(i) =>
                      setHoverRow(
                        i === undefined ? undefined : { relation, index: i },
                      )
                    }
                    onSelect={(i) => selectRow({ relation, index: i })}
                  />
                </div>
              )}
            </Panel>
          </>
        )}

        {pinned && pinnedRow && (
          <Panel
            title={
              <span>
                Why does this row hold?{' '}
                {proof?.result && (
                  <span className="muted small">
                    (Soufflé answered in {ms(proof.result.ms)})
                  </span>
                )}
              </span>
            }
            actions={
              <>
                {pinnedNodeId !== undefined && (
                  <>
                    <button
                      type="button"
                      className="btn small"
                      onClick={() =>
                        setNav({
                          step: 2,
                          astNode: index.nodeOfNumId(pinnedNodeId),
                          range: pinnedRange,
                          line: pinnedRange
                            ? index.lineOf(pinnedRange.start)
                            : undefined,
                          nonce: nav.nonce + 1,
                        })
                      }
                    >
                      node #{pinnedNodeId} in the AST (step 2)
                    </button>
                    <button
                      type="button"
                      className="btn small"
                      onClick={() =>
                        setNav({
                          step: 3,
                          baseNodeId: pinnedNodeId,
                          baseLine: undefined,
                          range: pinnedRange,
                          line: pinnedRange
                            ? index.lineOf(pinnedRange.start)
                            : undefined,
                          nonce: nav.nonce + 1,
                        })
                      }
                    >
                      its base rows (step 3)
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn small"
                  onClick={() => showRange(pinnedRange)}
                >
                  re-center source
                </button>
                <button
                  type="button"
                  className="btn small"
                  onClick={() =>
                    setNav({ factRef: undefined, range: undefined })
                  }
                >
                  ✕
                </button>
              </>
            }
          >
            <p className="mono small" style={{ wordBreak: 'break-all' }}>
              {pinned.relation}
              {'\t'}
              {pinnedRow.join(' ⇥ ')}
            </p>
            <p className="small muted">
              Ids in this row:{' '}
              {pinnedRow
                .filter((c) => index.isId(c))
                .map((c) => (
                  <IdChip key={c} id={c} />
                ))}
            </p>
            {proof?.loading && (
              <p className="muted">
                <span className="spinner" /> re-running Soufflé with provenance
                tracking…
              </p>
            )}
            {proof?.error && <div className="err">{proof.error}</div>}
            {proof?.result && (
              <>
                <p className="small muted">
                  Read top-down: each <b>↳</b> tuple was produced by the rule
                  shown, from the tuples indented under it, down to <b>●</b>{' '}
                  base rows from step 3 (with the source line of the node they
                  describe). <b>∄</b> marks a negated atom the rule checked was
                  absent.
                </p>
                <div className="proof">
                  <ProofTree node={proof.result.proof} />
                </div>
              </>
            )}
          </Panel>
        )}

        <Panel
          title={`The rules of this layer · rules/concepts.dl · ${conceptRuleCount} rules`}
          actions={
            <button
              type="button"
              className="btn small"
              onClick={() => setShowRules(!showRules)}
            >
              {showRules ? 'hide' : 'show all rule cards'}
            </button>
          }
          tight
        >
          <div className="panel-body">
            {!showRules && (
              <p className="small muted" style={{ margin: 0 }}>
                Naming, statements, calls, writes, storage references and inline
                assembly, each as commented rules over the raw rows. Open to
                read them, or pin a row above to see only the rules it used.
              </p>
            )}
            {showRules && (
              <>
                {conceptSections.length === 0 && (
                  <p className="muted">(concepts.dl has no sections?)</p>
                )}
                <RuleCards
                  sections={conceptSections}
                  focus={nav.focusRelation}
                  isOutput={(n) => index.relations.get(n)?.isOutput ?? false}
                  countOf={(n) => index.concepts.get(n)?.length ?? 0}
                  onJump={jump}
                  onShowTuples={(n) => {
                    if (index.concepts.has(n))
                      setNav({
                        relation: n,
                        filterLine: undefined,
                        filterNodeId: undefined,
                        factRef: undefined,
                      })
                  }}
                />
              </>
            )}
          </div>
        </Panel>

        {clauses.length > 0 && !showRules && (
          <Panel title={`The rule${clauses.length === 1 ? '' : 's'} behind ${relation}`} tight>
            <div className="panel-body">
              {clauses.map((c) => (
                <div key={c.line} style={{ margin: '6px 0' }}>
                  {c.kind === 'clause' && c.comment && (
                    <div className="muted small" style={{ fontStyle: 'italic' }}>
                      {c.comment}
                    </div>
                  )}
                  <DatalogView
                    text={c.kind === 'clause' ? c.text : ''}
                    firstLine={c.line}
                    onRelationClick={jump}
                  />
                </div>
              ))}
            </div>
          </Panel>
        )}

        <Callout kind="plain">
          <b>Where this lives on disk:</b> the rules are{' '}
          <code>rules/concepts.dl</code>; the rows are{' '}
          <code>{run.runDir}/derived/&lt;relation&gt;.csv</code>, next to the
          analysis relations of step 6. The legacy TypeScript extractor's output
          on 43 contracts is the parity oracle these rules are checked against
          (<code>src/parity.ts</code>).
        </Callout>
      </div>
    </div>
  )
}
