import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ExplainResult, RunInfo, RunListItem } from '../shared/types'
import { api } from './api'
import { AtomText } from './components/Atom'
import { ProofTree } from './components/ProofTree'
import { AppContext, type AppCtx, type Screen } from './lib/context'
import { AskScreen } from './screens/Ask'
import { InputsScreen } from './screens/Inputs'
import { RulesScreen } from './screens/Rules'

const SCREENS: Array<[Screen, string, string]> = [
  [
    1,
    'Inputs → facts',
    'Solidity files and a discovery snapshot, written down as facts',
  ],
  [2, 'Rules → derived', 'one library of rules, what it derives, and why'],
  [
    3,
    'Ask',
    'questions answered by writing rules, with the tuples as evidence',
  ],
]

interface Proof {
  atom: string
  ask?: string
  result?: ExplainResult
  error?: string
  loading: boolean
}

export function App() {
  const [runs, setRuns] = useState<RunListItem[]>([])
  const [runId, setRunId] = useState<string | undefined>()
  const [run, setRun] = useState<RunInfo | undefined>()
  const [screen, setScreen] = useState<Screen>(1)
  const [focusRelation, setFocusRelation] = useState<string | undefined>()
  const [focusUnit, setFocusUnit] = useState<string | undefined>()
  const [proofs, setProofs] = useState<Proof[]>([])
  const [error, setError] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(false)

  const refreshRuns = useCallback(async () => {
    const list = await api.runs()
    setRuns(list)
    return list
  }, [])

  const openRun = useCallback(async (id: string) => {
    setLoading(true)
    setError(undefined)
    try {
      const info = await api.run(id)
      setRunId(id)
      setRun(info)
      setProofs([])
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshRuns()
      .then((list) => {
        const first = list[0]
        if (first) void openRun(first.id)
        else setStarting(true)
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      )
  }, [refreshRuns, openRun])

  const relations = useMemo(
    () => new Map((run?.library.relations ?? []).map((r) => [r.name, r])),
    [run],
  )

  const why = useCallback(
    (atom: string, ask?: string) => {
      if (!runId) return
      const entry: Proof = { atom, ask, loading: true }
      setProofs((prev) =>
        [entry, ...prev.filter((p) => p.atom !== atom)].slice(0, 6),
      )
      api
        .explain({ id: runId, atom, ask })
        .then((result) =>
          setProofs((prev) =>
            prev.map((p) =>
              p.atom === atom ? { ...p, result, loading: false } : p,
            ),
          ),
        )
        .catch((e: unknown) =>
          setProofs((prev) =>
            prev.map((p) =>
              p.atom === atom
                ? {
                    ...p,
                    error: e instanceof Error ? e.message : String(e),
                    loading: false,
                  }
                : p,
            ),
          ),
        )
    },
    [runId],
  )

  const ctx: AppCtx | undefined =
    run && runId
      ? {
          runId,
          run,
          relation: (name) => relations.get(name),
          why,
          showRelation: (name) => {
            setFocusRelation(name)
            setScreen(2)
          },
          showUnit: (slug) => {
            setFocusUnit(slug)
            setScreen(1)
          },
        }
      : undefined

  const onRunStarted = async (info: RunInfo) => {
    await refreshRuns()
    setRunId(info.meta.id)
    setRun(info)
    setStarting(false)
    setProofs([])
  }

  return (
    <div className={`app ${proofs.length > 0 ? 'with-drawer' : ''}`}>
      <header className="header">
        <div className="title">
          <h1>Facts, rules, questions</h1>
          <span className="sub">
            contracts and a discovery snapshot as facts · one rule library · an
            AI that answers by writing rules
          </span>
          <span className="grow" />
          <label className="row small">
            <span>run</span>
            <select
              value={starting ? '' : (runId ?? '')}
              onChange={(e) => {
                if (e.target.value === '') {
                  setStarting(true)
                  setScreen(1)
                } else {
                  setStarting(false)
                  void openRun(e.target.value)
                }
              }}
            >
              <option value="">new run…</option>
              {runs.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ·{' '}
                  {r.kind === 'project'
                    ? `${r.ok}/${r.units} files`
                    : 'one file'}{' '}
                  · {new Date(r.createdAt).toLocaleString()}
                  {r.asks
                    ? ` · ${r.asks} question${r.asks === 1 ? '' : 's'}`
                    : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
        <nav className="stepper">
          {SCREENS.map(([n, label, hint]) => (
            <button
              type="button"
              key={n}
              className={`step-btn ${screen === n ? 'active' : ''}`}
              disabled={n > 1 && !run}
              onClick={() => setScreen(n)}
              title={hint}
            >
              <span className="num">{n}</span>
              <span>{label}</span>
            </button>
          ))}
          {loading && <span className="spinner" />}
        </nav>
      </header>
      <main className="main">
        {error && <div className="err">{error}</div>}
        {screen === 1 && (
          <InputsScreen
            run={starting ? undefined : run}
            runId={starting ? undefined : runId}
            ctx={ctx}
            focusUnit={focusUnit}
            onRunStarted={onRunStarted}
            startOpen={starting || !run}
          />
        )}
        {ctx && screen === 2 && (
          <AppContext.Provider value={ctx}>
            <RulesScreen focus={focusRelation} />
          </AppContext.Provider>
        )}
        {ctx && screen === 3 && (
          <AppContext.Provider value={ctx}>
            <AskScreen />
          </AppContext.Provider>
        )}
      </main>
      {ctx && proofs.length > 0 && (
        <AppContext.Provider value={ctx}>
          <aside className="drawer">
            <div className="drawer-head">
              <b>Why does it hold?</b>
              <span className="muted small">
                Soufflé's proof; leaves derived in another stage unfold on
                demand
              </span>
              <span className="grow" />
              <button
                type="button"
                className="btn small"
                onClick={() => setProofs([])}
              >
                close
              </button>
            </div>
            {proofs.map((p) => (
              <div className="proof" key={p.atom}>
                <div className="proof-head">
                  <AtomText text={p.atom} ask={p.ask} plain />
                  {p.result && (
                    <span className="muted small">
                      {p.result.home.stage === 'query'
                        ? `query ${p.result.home.query ?? ''}`
                        : `${p.result.home.stage} stage`}
                      {p.result.home.slug ? ` · ${p.result.home.slug}` : ''} ·{' '}
                      {Math.round(p.result.ms)} ms
                    </span>
                  )}
                  <span className="grow" />
                  <button
                    type="button"
                    className="btn small"
                    onClick={() =>
                      setProofs((prev) => prev.filter((x) => x.atom !== p.atom))
                    }
                  >
                    ×
                  </button>
                </div>
                {p.loading && (
                  <div className="muted small">
                    <span className="spinner" /> asking Soufflé…
                  </div>
                )}
                {p.error && <div className="err">{p.error}</div>}
                {p.result && <ProofTree node={p.result.proof} ask={p.ask} />}
              </div>
            ))}
          </aside>
        </AppContext.Provider>
      )}
    </div>
  )
}
