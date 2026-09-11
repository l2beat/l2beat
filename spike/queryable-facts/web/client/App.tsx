import { useCallback, useMemo, useRef, useState } from 'react'
import type { ProjectRunResult, RunResult } from '../shared/types'
import { api } from './api'
import { ms } from './components/ui'
import { type Ctx, type Nav, type ProjectCtx, RunContext } from './lib/context'
import { type Range, RunIndex } from './lib/run'
import { Step1Contract } from './steps/Step1Contract'
import { Step2Compile } from './steps/Step2Compile'
import { Step3Facts } from './steps/Step3Facts'
import { Step4Concepts } from './steps/Step4Concepts'
import { Step5Rules } from './steps/Step5Rules'
import { Step6Derive } from './steps/Step6Derive'
import { Step7Report } from './steps/Step7Report'
import { Step8Project } from './steps/Step8Project'

const STEPS = [
  ['📄', 'Contract'],
  ['⚙️', 'Compile'],
  ['🧱', 'Tree as facts'],
  ['🔎', 'Concepts'],
  ['📜', 'Rules'],
  ['🔁', 'Derive'],
  ['📊', 'Report & ask'],
  ['🌐', 'Project'],
]
const LAST = STEPS.length

/** `<unit>:…` → the unit, given the unit names of a project run (longest first). */
function unitPrefixes(project: ProjectRunResult): string[] {
  return project.units.map((u) => u.unit).sort((a, b) => b.length - a.length)
}

function shortAddress(a: string): string {
  const m = /^(?:[a-z0-9]+:)?(0x[0-9a-fA-F]{40})$/.exec(a)
  if (!m?.[1]) return a
  return `${m[1].slice(0, 6)}…${m[1].slice(-4)}`
}

export function App() {
  const [run, setRun] = useState<RunResult | undefined>()
  const [project, setProject] = useState<ProjectRunResult | undefined>()
  const [choice, setChoice] = useState<string | undefined>()
  const [running, setRunning] = useState(false)
  const [loadingUnit, setLoadingUnit] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [nav, setNavState] = useState<Nav>({ step: 1, nonce: 0 })
  const index = useMemo(() => (run ? new RunIndex(run) : undefined), [run])
  // What to do once a unit picked from another step has loaded (e.g. highlight a cited id there).
  const afterLoad = useRef<((index: RunIndex) => void) | undefined>(undefined)

  const setNav = useCallback(
    (patch: Partial<Nav>) => setNavState((prev) => ({ ...prev, ...patch })),
    [],
  )

  const onRun = async (name: string, source: string, pickedChoice: string) => {
    setRunning(true)
    setError(undefined)
    try {
      const result = await api.run(name, source)
      setProject(undefined)
      setRun(result)
      setChoice(pickedChoice)
      setNavState({ step: 2, nonce: 0 })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }

  const onProjectRun = async (
    result: ProjectRunResult,
    pickedChoice: string,
  ) => {
    setProject(result)
    setChoice(pickedChoice)
    setRun(undefined)
    setNavState({ step: 8, nonce: 0, projectTab: 'overview' })
    // load the first compiled unit so steps 2–7 have something to show
    const first = result.units.find((u) => u.status === 'ok')
    if (first) await loadUnit(result.runId, first.slug)
  }

  const loadUnit = async (runId: string, slug: string) => {
    setLoadingUnit(slug)
    setError(undefined)
    try {
      const unitRun = await api.projectUnit(runId, slug)
      setRun(unitRun)
      const then = afterLoad.current
      afterLoad.current = undefined
      if (then) then(new RunIndex(unitRun))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoadingUnit(undefined)
    }
  }

  const names = useMemo(() => {
    const m = new Map<string, string>()
    if (!project) return m
    for (const c of project.contracts) m.set(c.address, c.name)
    for (const [a = '', n = ''] of project.derived.find(
      (d) => d.relation === 'eoa',
    )?.rows ?? [])
      if (n) m.set(a, n)
    return m
  }, [project])

  const projectCtx: ProjectCtx | undefined = project
    ? {
        result: project,
        unitSlug: run?.unitSlug,
        selectUnit: (slug, then) => {
          if (slug === run?.unitSlug) {
            if (then && index) then(index)
            return
          }
          afterLoad.current = then
          void loadUnit(project.runId, slug)
        },
        unitOf: (id) =>
          unitPrefixes(project).find((u) => id.startsWith(`${u}:`)),
        who: (a) => {
          if (a === 'anyone') return 'anyone'
          const n = names.get(a)
          return n ? `${n} (${shortAddress(a)})` : shortAddress(a)
        },
      }
    : undefined

  const ctx: Ctx | undefined = index
    ? {
        index,
        nav,
        setNav,
        showRange: (range: Range | undefined) =>
          setNavState((prev) => ({
            ...prev,
            range,
            line: range ? index.lineOf(range.start) : prev.line,
            nonce: prev.nonce + 1,
          })),
        showId: (id: string) => {
          const range = index.rangeOfId(id)
          setNavState((prev) => ({
            ...prev,
            range,
            line: range ? index.lineOf(range.start) : prev.line,
            nonce: prev.nonce + 1,
          }))
        },
        project: projectCtx,
      }
    : undefined

  const step = nav.step
  const goTo = (s: number) => setNav({ step: s })
  const hasRun = Boolean(run) || Boolean(project)

  return (
    <div className="app">
      <header className="header">
        <div className="title">
          <h1>Queryable contract facts</h1>
          <span className="sub">
            from Solidity files and a discovery snapshot to facts, rules and
            derived relations · L2B-14851 spike
          </span>
        </div>
        <nav className="stepper">
          {STEPS.map(([icon, label], i) => {
            const n = i + 1
            const disabled = n === 8 ? !project : n > 1 && !run
            return (
              <button
                type="button"
                key={label}
                className={`step-btn ${step === n ? 'active' : ''} ${hasRun && n < step ? 'done' : ''}`}
                disabled={disabled}
                onClick={() => goTo(n)}
              >
                <span className="num">{n}</span>
                <span className="icon">{icon}</span>
                <span>{label}</span>
              </button>
            )
          })}
        </nav>
      </header>

      <div className="runbar">
        {project && (
          <>
            <span>
              <b>{project.project}</b> · {project.contracts.length} contracts ·{' '}
              {project.units.filter((u) => u.status === 'ok').length}/
              {project.units.length} units
            </span>
            <label className="row small">
              <span>unit in steps 2–7</span>
              <select
                value={run?.unitSlug ?? ''}
                disabled={Boolean(loadingUnit)}
                onChange={(e) => void loadUnit(project.runId, e.target.value)}
              >
                {project.contracts.map((c) => (
                  <optgroup
                    key={c.address}
                    label={`${c.name} · ${shortAddress(c.address)}`}
                  >
                    {c.units.map((u) => (
                      <option
                        key={u.slug}
                        value={u.slug}
                        disabled={u.status !== 'ok'}
                      >
                        {u.role}: {u.unit}
                        {u.status !== 'ok' ? ' (failed)' : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {loadingUnit && <span className="spinner" />}
            </label>
          </>
        )}
        {run && index ? (
          <>
            <span>
              <b>{run.unit}</b> · {run.source.split('\n').length} lines
            </span>
            <span className="flow">
              <span className="box">
                solc {run.compile.solcVersion.split('+')[0]}
              </span>
              →<span className="box">{index.baseCount} base rows</span>→
              <span className="box">{index.conceptCount} concepts</span>→
              <span className="box">
                {run.program.items.filter((i) => i.kind === 'clause').length}{' '}
                rules
              </span>
              →<span className="box">{index.derivedCount} derived tuples</span>
            </span>
            <span>
              compile {ms(run.timings.compileMs)} + emit{' '}
              {ms(run.timings.emitMs)} + Soufflé {ms(run.timings.souffleMs)} ={' '}
              <b>
                {ms(
                  run.timings.compileMs +
                    run.timings.emitMs +
                    run.timings.souffleMs,
                )}
              </b>
            </span>
            <span className="mono">{run.runDir}</span>
          </>
        ) : project ? (
          <span className="mono">{project.runDir}</span>
        ) : (
          <span>
            No run yet — pick a contract or a project and press “Run the
            pipeline”.
          </span>
        )}
      </div>

      <main className="main">
        {step === 1 && (
          <Step1Contract
            initial={
              run && !project
                ? { name: run.unit, source: run.source, choice }
                : project
                  ? { choice }
                  : undefined
            }
            onRun={onRun}
            onProjectRun={onProjectRun}
            running={running}
            error={error}
            hasRun={hasRun}
            goTo={goTo}
          />
        )}
        {ctx && (
          <RunContext.Provider value={ctx}>
            {step === 2 && <Step2Compile />}
            {step === 3 && <Step3Facts />}
            {step === 4 && <Step4Concepts />}
            {step === 5 && <Step5Rules />}
            {step === 6 && <Step6Derive />}
            {step === 7 && <Step7Report />}
            {step === 8 && project && <Step8Project />}
          </RunContext.Provider>
        )}
        {!ctx && step === 8 && project && (
          <div className="step">
            <p className="muted">
              <span className="spinner" /> loading a unit of the project…
            </p>
            {error && <div className="err">{error}</div>}
          </div>
        )}
      </main>

      <footer className="footer">
        <button
          type="button"
          className="btn"
          disabled={step === 1}
          onClick={() => goTo(step - 1)}
        >
          ← Back
        </button>
        <span className="hint">
          {step === 1 &&
            !hasRun &&
            'Run the pipeline to unlock the next steps.'}
          {step === 2 && 'Click a word in the source, or a node in the tree.'}
          {step === 3 &&
            'Click a word to see how its node was written down as rows.'}
          {step === 4 &&
            'Pin a row to see the rule that produced it and the raw rows it used.'}
          {step === 5 && 'Relation names in the rules are links.'}
          {step === 6 &&
            'Press “why?” on a tuple to get its proof tree from Soufflé.'}
          {step === 7 &&
            'Tuples, ids and line numbers cited in the report and in the answers are links back into steps 3–6.'}
          {step === 8 &&
            'The project level: discovery as facts, the project rules, what they derive, and an AI that answers across contracts.'}
        </span>
        <button
          type="button"
          className="btn primary"
          disabled={!hasRun || step === LAST || (step === 7 && !project)}
          onClick={() => goTo(step + 1)}
        >
          Next →
        </button>
      </footer>
    </div>
  )
}
