import { useCallback, useMemo, useState } from 'react'
import type { RunResult } from '../shared/types'
import { api } from './api'
import { ms } from './components/ui'
import { type Ctx, type Nav, RunContext } from './lib/context'
import { type Range, RunIndex } from './lib/run'
import { Step1Contract } from './steps/Step1Contract'
import { Step2Compile } from './steps/Step2Compile'
import { Step3Facts } from './steps/Step3Facts'
import { Step4Rules } from './steps/Step4Rules'
import { Step5Derive } from './steps/Step5Derive'
import { Step6Report } from './steps/Step6Report'

const STEPS = [
  ['📄', 'Contract'],
  ['⚙️', 'Compile'],
  ['🧱', 'Extract facts'],
  ['📜', 'Rules'],
  ['🔁', 'Derive'],
  ['📊', 'Report & ask'],
]

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
                className={`step-btn ${step === n ? 'active' : ''} ${run && n < step ? 'done' : ''} ${n === 6 ? 'future' : ''}`}
                disabled={disabled}
                onClick={() => goTo(n)}
                title={n === 6 ? 'placeholder — next iteration' : undefined}
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
              →<span className="box">{index.factCount} facts</span>→
              <span className="box">
                {run.program.items.filter((i) => i.kind === 'clause').length}{' '}
                rules
              </span>
              →<span className="box">{index.derivedCount} derived tuples</span>
            </span>
            <span>
              compile {ms(run.timings.compileMs)} + extract{' '}
              {ms(run.timings.extractMs)} + Soufflé {ms(run.timings.souffleMs)}{' '}
              ={' '}
              <b>
                {ms(
                  run.timings.compileMs +
                    run.timings.extractMs +
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
            {step === 4 && <Step4Rules />}
            {step === 5 && <Step5Derive />}
            {step === 6 && <Step6Report />}
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
            'Hover the source; badges count the facts that start on each line.'}
          {step === 4 && 'Relation names in the rules are links.'}
          {step === 5 &&
            'Press “why?” on a tuple to get its proof tree from Soufflé.'}
        </span>
        <button
          type="button"
          className="btn primary"
          disabled={!run || step === 6}
          onClick={() => goTo(step + 1)}
        >
          Next →
        </button>
      </footer>
    </div>
  )
}
