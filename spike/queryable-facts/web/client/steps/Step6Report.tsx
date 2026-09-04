import { Callout, Panel } from '../components/ui'
import { useRun } from '../lib/context'

export function Step6Report() {
  const { index } = useRun()
  const run = index.run
  return (
    <div className="step">
      <div className="intro">
        <h2>📊 Step 6 · Report and questions — next iteration</h2>
        <p className="lead">
          This page is deliberately empty for now. The plan: render the report
          that the pipeline already writes, and add a box where you can ask an
          AI about the contract. The AI will be pointed at the run folder below
          (facts, program, derived relations) and at the <code>souffle</code>{' '}
          command line, so its answers can be traced back through steps 5 → 3 →
          1 the same way you just did by hand.
        </p>
      </div>
      <Panel title={`Everything this run produced · ${run.runDir}`}>
        <ul
          className="mono small"
          style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}
        >
          {run.files.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </Panel>
      <Callout kind="plain">
        The folder has a <code>README.txt</code> explaining each file and how to
        re-run Soufflé or ask it to explain a tuple by hand.
      </Callout>
    </div>
  )
}
