import { useCallback, useMemo, useState } from 'react'
import type { RunResult } from '../shared/types'
import { api } from './api'
import { ms } from './components/ui'
import { type Ctx, type Nav, RunContext } from './lib/context'
import { type Range, RunIndex } from './lib/run'
import { Step1Contract } from './steps/Step1Contract'
import { Step2Compile } from './steps/Step2Compile'
import { Step3Facts } from './steps/Step3Facts'
import { Step4Concepts } from './steps/Step4Concepts'
import { Step5Rules } from './steps/Step5Rules'
import { Step6Derive } from './steps/Step6Derive'
import { Step7Report } from './steps/Step7Report'

const STEPS = [
  ['📄', 'Contract'],
  ['⚙️', 'Compile'],
  ['🧱', 'Tree as facts'],
  ['🔎', 'Concepts'],
  ['📜', 'Rules'],
  ['🔁', 'Derive'],
  ['📊', 'Report & ask'],
]
const LAST = STEPS.length

export function App() {
  const [run, setRun] = useState<RunResult | undefined>()
  const [choice, setChoice] = useState<string | undefined>()
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [nav, setNavState] = useState<Nav>({ step: 1, nonce: 0 })
  const index = useMemo(() => (run ? new RunIndex(run) : undefined), [run])

  const setNav = useCallback(
    (patch: Partial<Nav>) => setNavState((prev) => ({ ...prev, ...patch })),
    [],
  )

  const onRun = async (name: string, source: string, pickedChoice: string) => {
    setRunning(true)
    setError(undefined)
    try {
      const result = await api.run(name, source)
      setRun(result)
      setChoice(pickedChoice)
      setNavState({ step: 2, nonce: 0 })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }

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
      }
    : undefined

  const step = nav.step
  const goTo = (s: number) => setNav({ step: s })

  return (
    <div className="app">
      <header className="header">
        <div className="title">
          <h1>Queryable contract facts</h1>
          <span className="sub">
            from a Solidity file to facts, rules and derived relations ·
            L2B-14851 spike
          </span>
        </div>
        <nav className="stepper">
          {STEPS.map(([icon, label], i) => {
            const n = i + 1
            const disabled = n > 1 && !run
            return (
              <button
                type="button"
                key={label}
                className={`step-btn ${step === n ? 'active' : ''} ${run && n < step ? 'done' : ''} ${n === LAST ? 'future' : ''}`}
                disabled={disabled}
                onClick={() => goTo(n)}
                title={n === LAST ? 'placeholder — next iteration' : undefined}
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
        ) : (
          <span>
            No run yet — pick a contract and press “Run the pipeline”.
          </span>
        )}
      </div>

      <main className="main">
        {step === 1 && (
          <Step1Contract
            initial={
              run ? { name: run.unit, source: run.source, choice } : undefined
            }
            onRun={onRun}
            running={running}
            error={error}
            hasRun={Boolean(run)}
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
          </RunContext.Provider>
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
          {step === 1 && !run && 'Run the pipeline to unlock the next steps.'}
          {step === 2 && 'Click a word in the source, or a node in the tree.'}
          {step === 3 &&
            'Click a word to see how its node was written down as rows.'}
          {step === 4 &&
            'Pin a row to see the rule that produced it and the raw rows it used.'}
          {step === 5 && 'Relation names in the rules are links.'}
          {step === 6 &&
            'Press “why?” on a tuple to get its proof tree from Soufflé.'}
        </span>
        <button
          type="button"
          className="btn primary"
          disabled={!run || step === LAST}
          onClick={() => goTo(step + 1)}
        >
          Next →
        </button>
      </footer>
    </div>
  )
}
