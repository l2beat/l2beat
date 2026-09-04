import { useMemo, useState } from 'react'
import { FactsTable } from '../components/FactsTable'
import { IdChip } from '../components/IdChip'
import { type Highlight, SourceView } from '../components/SourceView'
import { Callout, kib, ms, Panel } from '../components/ui'
import { useRun } from '../lib/context'
import type { RowRef } from '../lib/run'

/** Base relations grouped the way a reader thinks about a contract. */
export const FACT_GROUPS: Array<[string, string[]]> = [
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
  ['Bookkeeping', ['sourceLoc', 'unhandled']],
]

export function Step3Facts() {
  const { index, nav, setNav, showRange } = useRun()
  const run = index.run
  const [hoverLine, setHoverLine] = useState<number | undefined>()
  const [hoverRow, setHoverRow] = useState<RowRef | undefined>()
  const [raw, setRaw] = useState(false)
  const relation = nav.relation ?? 'writeSite'
  const info = index.relations.get(relation)
  const rows = index.facts.get(relation) ?? []

  const badges = useMemo(() => {
    const m = new Map<number, number>()
    for (const [line, refs] of index.rowsByLine) m.set(line, refs.length)
    return m
  }, [index])

  // Filtered view: facts that came from one line or one node.
  const filtered: RowRef[] | undefined =
    nav.filterNodeId !== undefined
      ? (index.rowsByNodeId.get(nav.filterNodeId) ?? [])
      : nav.filterLine !== undefined
        ? (index.rowsByLine.get(nav.filterLine) ?? [])
        : undefined
  const filterLabel =
    nav.filterNodeId !== undefined
      ? `facts emitted from AST node #${nav.filterNodeId} (${index.nodesById.get(nav.filterNodeId)?.nodeType ?? '?'})`
      : nav.filterLine !== undefined
        ? `facts whose origin starts on line ${nav.filterLine}`
        : undefined

  const selectedRow = nav.factRef ? index.row(nav.factRef) : undefined
  const selectedRange = index.rangeOfOrigin(selectedRow?.origin)
  const hoverRange = hoverRow
    ? index.rangeOfOrigin(index.row(hoverRow)?.origin)
    : undefined
  const highlights: Highlight[] = []
  if (selectedRange) highlights.push({ ...selectedRange, kind: 'primary' })
  if (hoverRange) highlights.push({ ...hoverRange, kind: 'secondary' })
  if (nav.range && !selectedRange)
    highlights.push({ ...nav.range, kind: 'primary' })
  const activeLine = hoverLine ?? nav.filterLine

  const selectRow = (ref: RowRef) => {
    const row = index.row(ref)
    const range = index.rangeOfOrigin(row?.origin)
    setNav({
      factRef: ref,
      range,
      line: range ? index.lineOf(range.start) : undefined,
      nonce: nav.nonce + 1,
    })
  }

  return (
    <div className="step split">
      <div className="pane">
        <div className="pane-head">
          <h3>
            Source · badge = facts that start on this line · click a badge to
            list them
          </h3>
        </div>
        <SourceView
          text={run.source}
          lang="solidity"
          highlights={highlights}
          badges={badges}
          activeLine={activeLine}
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
            if (index.rowsByLine.has(line))
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
          <h2>🧱 Step 3 · Write down what the tree says, as facts</h2>
          <p className="lead">
            The extractor walks the AST once and records what it sees, one row
            per observation, in tab-separated files: one file per{' '}
            <b>relation</b>. It never reasons. No "transitively", no "always": a
            function exists, a statement sits inside another, this assignment
            targets that variable, this call names that function. Every row is
            something the compiler already knew, re-encoded so a query engine
            can join on it. Reasoning is the job of the rules in the next step.
          </p>
          <div className="stats">
            <span className="stat">
              <span className="v">{index.factCount}</span>
              <span className="l">fact rows</span>
            </span>
            <span className="stat">
              <span className="v">
                {run.facts.filter((f) => f.rows.length > 0).length}/
                {run.facts.length}
              </span>
              <span className="l">relations non-empty</span>
            </span>
            <span className="stat">
              <span className="v">{ms(run.timings.extractMs)}</span>
              <span className="l">to extract</span>
            </span>
            <span className="stat">
              <span className="v">
                {kib(
                  run.facts.reduce(
                    (n, f) =>
                      n +
                      f.rows.reduce(
                        (m, r) => m + r.cols.join('\t').length + 1,
                        0,
                      ),
                    0,
                  ),
                )}
              </span>
              <span className="l">of TSV</span>
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
              Ids are plain strings, readable without a lookup table, and stable
              across runs as long as the text does not move. Every id has a{' '}
              <code>sourceLoc</code> row; the chips in the tables are clickable
              and jump to it.
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
              <p className="muted">Nothing was emitted from here.</p>
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
                      all {index.facts.get(rel)?.length ?? 0} rows →
                    </button>
                  </div>
                  <FactsTable
                    columns={cols}
                    rows={refs.map((r) => index.row(r)?.cols ?? [])}
                    selected={refs.findIndex(
                      (r) =>
                        nav.factRef &&
                        r.relation === nav.factRef.relation &&
                        r.index === nav.factRef.index,
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
              {FACT_GROUPS.map(([group, names]) => (
                <div className="rel-group" key={group}>
                  <div className="g">{group}</div>
                  <div className="rel-list">
                    {names.map((name) => {
                      const n = index.facts.get(name)?.length ?? 0
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
                    onClick={() => setRaw(!raw)}
                  >
                    {raw ? 'table' : `raw ${relation}.facts`}
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
                    (no comment in schema.dl for this relation)
                  </p>
                )}
                <p className="small muted">
                  Hover a row to see where it came from; click to pin it and
                  inspect its origin.
                </p>
              </div>
              {raw ? (
                <pre className="tsv">
                  {rows.map((r) => r.cols.join('\t')).join('\n') ||
                    '(empty file)'}
                </pre>
              ) : (
                <div style={{ maxHeight: 460, overflow: 'auto' }}>
                  <FactsTable
                    columns={info?.columns ?? []}
                    rows={rows.map((r) => r.cols)}
                    selected={
                      nav.factRef?.relation === relation
                        ? nav.factRef.index
                        : undefined
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

        {selectedRow && nav.factRef && (
          <Panel
            title="Where the pinned row came from"
            actions={
              <button
                type="button"
                className="btn small"
                onClick={() => setNav({ factRef: undefined, range: undefined })}
              >
                ✕
              </button>
            }
          >
            <p className="mono small" style={{ wordBreak: 'break-all' }}>
              {nav.factRef.relation}
              {'\t'}
              {selectedRow.cols.join(' ⇥ ')}
            </p>
            {selectedRow.origin ? (
              <>
                <p className="small">
                  Emitted while the extractor visited the{' '}
                  <b className="mono">{selectedRow.origin.nodeType}</b> node
                  {selectedRow.origin.id !== undefined ? (
                    <span className="mono"> #{selectedRow.origin.id}</span>
                  ) : (
                    ' (a Yul node)'
                  )}
                  , which covers lines{' '}
                  {selectedRange
                    ? `${index.lineOf(selectedRange.start)}–${index.lineOf(Math.max(selectedRange.end - 1, 0))}`
                    : '?'}{' '}
                  of the source (highlighted).
                </p>
                <div className="row">
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => {
                      const node = index.nodeOfOrigin(selectedRow.origin)
                      setNav({
                        step: 2,
                        astNode: node,
                        range: selectedRange,
                        line: selectedRange
                          ? index.lineOf(selectedRange.start)
                          : undefined,
                        nonce: nav.nonce + 1,
                      })
                    }}
                  >
                    show this node in the AST (step 2)
                  </button>
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => showRange(selectedRange)}
                  >
                    re-center source
                  </button>
                </div>
                <p className="small muted" style={{ marginTop: 6 }}>
                  Columns that are ids:{' '}
                  {selectedRow.cols
                    .filter((c) => index.isId(c))
                    .map((c) => (
                      <IdChip key={c} id={c} />
                    ))}
                </p>
              </>
            ) : (
              <p className="small muted">
                This row has no single origin node (e.g. <code>codeUnit</code>{' '}
                describes the whole file).
              </p>
            )}
          </Panel>
        )}

        <Callout kind="plain">
          <b>Where this lives on disk:</b>{' '}
          <code>{run.runDir}/facts/&lt;relation&gt;.facts</code>, plus{' '}
          <code>facts-provenance.tsv</code> mapping every row to the AST node it
          came from.
        </Callout>
      </div>
    </div>
  )
}
