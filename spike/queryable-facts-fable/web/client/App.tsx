import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  ExplainResult,
  RelationView,
  RowsResult,
  RunView,
  State,
} from '../shared/types'
import { api } from './api'
import { DatalogView } from './components/DatalogView'
import { ProofTree } from './components/ProofTree'
import { RelationCard } from './components/RelationCard'
import { SolidityView } from './components/SolidityView'

interface Proof {
  atom: string
  result?: ExplainResult
  error?: string
}

export function App() {
  const [state, setState] = useState<State | undefined>()
  const [example, setExample] = useState<string>('')
  const [level, setLevel] = useState<number>(0)
  const [run, setRun] = useState<RunView | undefined>()
  const [source, setSource] = useState<string>('')
  const [locations, setLocations] = useState<Map<string, [number, number]>>(
    new Map(),
  )
  const [highlight, setHighlight] = useState<[number, number] | undefined>()
  const [openCards, setOpenCards] = useState<Set<string>>(new Set())
  const [showHelpers, setShowHelpers] = useState(false)
  const [showRules, setShowRules] = useState(true)
  const [showEarlier, setShowEarlier] = useState(false)
  const [proof, setProof] = useState<Proof | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api
      .state()
      .then((s) => {
        setState(s)
        const first = s.examples[0]
        if (first) setExample(first.id)
        setLevel(s.levels[s.levels.length - 1]?.n ?? 0)
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      )
  }, [])

  useEffect(() => {
    if (!example) return
    let alive = true
    setBusy(true)
    setError(undefined)
    setProof(undefined)
    setHighlight(undefined)
    Promise.all([api.run(example, level), api.source(example)])
      .then(async ([r, src]) => {
        if (!alive) return
        setRun(r)
        setSource(src)
        // The `location` relation (level 1) maps every id to its lines; it powers "show in the source".
        const map = new Map<string, [number, number]>()
        if (r.relations.some((x) => x.name === 'location' && x.isOutput)) {
          const loc = await api.rows(example, level, 'location')
          for (const row of loc.rows)
            map.set(row[0] ?? '', [Number(row[1]), Number(row[2])])
        }
        if (alive) setLocations(map)
      })
      .catch(
        (e: unknown) =>
          alive && setError(e instanceof Error ? e.message : String(e)),
      )
      .finally(() => alive && setBusy(false))
    return () => {
      alive = false
    }
  }, [example, level])

  const loadRows = useCallback(
    (relation: string): Promise<RowsResult> =>
      api.rows(example, level, relation),
    [example, level],
  )

  const why = useCallback(
    (atom: string) => {
      setProof({ atom })
      api
        .explain(example, level, atom)
        .then((result) => setProof({ atom, result }))
        .catch((e: unknown) =>
          setProof({
            atom,
            error: e instanceof Error ? e.message : String(e),
          }),
        )
    },
    [example, level],
  )

  const locate = useCallback(
    (id: string) => {
      const range = locations.get(id)
      if (range) setHighlight(range)
    },
    [locations],
  )

  const current = state?.levels.find((l) => l.n === level)
  const thisLevel = useMemo(
    () => (run?.relations ?? []).filter((r) => r.level === level),
    [run, level],
  )
  const earlier = useMemo(
    () =>
      (run?.relations ?? []).filter(
        (r) => r.level < level && (r.isOutput || r.isInput),
      ),
    [run, level],
  )
  const isResult = (r: RelationView) => r.isOutput || r.isInput
  const results = thisLevel.filter(isResult)
  const helpers = thisLevel.filter((r) => !isResult(r))
  const file = run?.files.find((f) => f.level === level)
  const knownIds = useMemo(() => new Set(locations.keys()), [locations])

  const toggle = (name: string) =>
    setOpenCards((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  const card = (rel: RelationView) => (
    <RelationCard
      key={rel.name}
      rel={rel}
      open={openCards.has(rel.name)}
      onToggle={() => toggle(rel.name)}
      loadRows={loadRows}
      onWhy={why}
      onLocate={locate}
      knownIds={knownIds}
    />
  )

  return (
    <div className="app">
      <header className="header">
        <div className="title">
          <h1>Queryable facts, level by level</h1>
          <span className="sub">
            a Solidity file becomes facts; each level adds a few rules and says
            exactly what it can claim
          </span>
          <span className="grow" />
          <label className="row small">
            <span>example</span>
            <select
              value={example}
              onChange={(e) => {
                setExample(e.target.value)
                setOpenCards(new Set())
              }}
            >
              {(state?.examples ?? []).map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.id} · {ex.lines} lines
                </option>
              ))}
            </select>
          </label>
        </div>
        <nav className="levels">
          {(state?.levels ?? []).map((l) => (
            <button
              type="button"
              key={l.n}
              className={`level-btn ${l.n === level ? 'active' : ''} ${l.n < level ? 'done' : ''}`}
              onClick={() => setLevel(l.n)}
              title={l.question}
            >
              <span className="num">{l.n}</span>
              <span>{l.title}</span>
            </button>
          ))}
          {busy && <span className="spinner" />}
          {run && (
            <span className="muted small timing">
              solc {run.meta.solc.split('+')[0]} · Soufflé{' '}
              {run.meta.timings.souffleMs.toFixed(0)} ms
            </span>
          )}
        </nav>
      </header>

      <main className="main">
        <section className="left">
          {error && <div className="err">{error}</div>}
          {current && (
            <div className="panel level-card">
              <div className="level-title">
                <span className="num big">{current.n}</span>
                <div>
                  <h2>{current.title}</h2>
                  <div className="question">{current.question}</div>
                </div>
              </div>
              <pre className="intro">{current.intro}</pre>
            </div>
          )}

          {run && (
            <>
              <div className="section-head">
                <h3>
                  {level === 0 ? 'The facts' : `What level ${level} produces`}
                </h3>
                <span className="muted small">
                  {results.length} relation{results.length === 1 ? '' : 's'}
                  {helpers.length > 0 &&
                    ` · ${helpers.length} helper${helpers.length === 1 ? '' : 's'}`}
                </span>
                <span className="grow" />
                {helpers.length > 0 && (
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => setShowHelpers((v) => !v)}
                  >
                    {showHelpers ? 'hide helpers' : 'show helpers'}
                  </button>
                )}
              </div>
              {results.map(card)}
              {showHelpers && helpers.length > 0 && (
                <>
                  <div className="section-head">
                    <h4>Helpers of this level</h4>
                    <span className="muted small">
                      scaffolding on the way to the tables above; not shown as
                      results
                    </span>
                  </div>
                  {helpers.map(card)}
                </>
              )}

              {earlier.length > 0 && (
                <>
                  <div className="section-head">
                    <h3>From earlier levels</h3>
                    <span className="muted small">
                      still available; the rules above build on them
                    </span>
                    <span className="grow" />
                    <button
                      type="button"
                      className="btn small"
                      onClick={() => setShowEarlier((v) => !v)}
                    >
                      {showEarlier ? 'hide' : `show ${earlier.length}`}
                    </button>
                  </div>
                  {showEarlier && earlier.map(card)}
                </>
              )}

              {file && (
                <>
                  <div className="section-head">
                    <h3>The rules of this level</h3>
                    <code className="muted small">rules/{file.name}</code>
                    <span className="grow" />
                    <button
                      type="button"
                      className="btn small"
                      onClick={() => setShowRules((v) => !v)}
                    >
                      {showRules ? 'hide' : 'show'}
                    </button>
                  </div>
                  {showRules && (
                    <div className="panel tight">
                      <DatalogView
                        text={file.text}
                        onRelationClick={(name) => {
                          if (run.relations.some((r) => r.name === name)) {
                            setOpenCards((prev) => new Set(prev).add(name))
                            document
                              .querySelector(`[data-card="${name}"]`)
                              ?.scrollIntoView({ block: 'start' })
                          }
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>

        <section className="right">
          <div className="section-head">
            <h3>examples/{example}.sol</h3>
            {highlight && (
              <span className="muted small">
                lines {highlight[0]}
                {highlight[1] !== highlight[0] ? `–${highlight[1]}` : ''}
              </span>
            )}
            <span className="grow" />
            {highlight && (
              <button
                type="button"
                className="btn small"
                onClick={() => setHighlight(undefined)}
              >
                clear
              </button>
            )}
          </div>
          <div className="panel tight source-panel">
            {source && <SolidityView text={source} highlight={highlight} />}
          </div>
        </section>
      </main>

      {proof && (
        <aside className="drawer">
          <div className="drawer-head">
            <b>Why does it hold?</b>
            <code className="atom">{proof.atom}</code>
            {proof.result && (
              <span className="muted small">
                {proof.result.ms.toFixed(0)} ms
              </span>
            )}
            <span className="grow" />
            <button
              type="button"
              className="btn small"
              onClick={() => setProof(undefined)}
            >
              close
            </button>
          </div>
          <div className="drawer-body">
            {!proof.result && !proof.error && (
              <div className="muted small">
                <span className="spinner" /> asking Soufflé…
              </div>
            )}
            {proof.error && <div className="err">{proof.error}</div>}
            {proof.result && <ProofTree node={proof.result.proof} />}
          </div>
        </aside>
      )}
    </div>
  )
}
