import { useState } from 'react'
import { Ask } from '../components/Ask'
import { Cite } from '../components/Cite'
import { Markdown } from '../components/Markdown'
import { type Highlight, SourceView } from '../components/SourceView'
import { Panel } from '../components/ui'
import { useRun } from '../lib/context'

export function Step7Report() {
  const { index, nav } = useRun()
  const run = index.run
  const [showSource, setShowSource] = useState(true)
  const highlights: Highlight[] = nav.range
    ? [{ ...nav.range, kind: 'primary' }]
    : []

  return (
    <div
      className="step split"
      style={{
        gridTemplateColumns: showSource
          ? 'minmax(360px, 1fr) minmax(420px, 1.15fr) minmax(280px, 27%)'
          : 'minmax(360px, 1fr) minmax(420px, 1.15fr)',
      }}
    >
      <div className="pane stack">
        <div className="intro" style={{ marginBottom: 0 }}>
          <h2>📊 Step 7 · Read the report, then ask</h2>
          <p className="lead">
            The report is <code>report.md</code>, rendered from the derived
            relations of step 6 in the shape of the storage-writers analyzer:
            who writes each storage variable, what the rules claim about each
            write, the entry points. Every id in it is a link into the source.
            Next to it an AI agent answers questions the rules were never asked,
            working in this run's folder with the same facts, program and CSVs,
            and citing tuples that link back into steps 3–6, so an answer can be
            checked the same way you just checked the rules.
          </p>
          <div className="row small muted">
            <span className="mono">{run.runDir}/report.md</span>
            <span style={{ flex: 1 }} />
            <button
              type="button"
              className="btn small"
              onClick={() => setShowSource(!showSource)}
            >
              {showSource ? 'hide source' : 'show source'}
            </button>
          </div>
        </div>
        <Panel title="report.md" tight>
          <div className="panel-body">
            <Markdown text={run.report} code={(c) => <Cite text={c} />} />
          </div>
        </Panel>
        <details className="more">
          <summary>
            everything this run produced · {run.files.length} entries in{' '}
            <span className="mono">{run.runDir}</span>
          </summary>
          <ul
            className="mono small"
            style={{ margin: '6px 0 0', paddingLeft: 18, lineHeight: 1.7 }}
          >
            {run.files.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="small muted" style={{ marginTop: 6 }}>
            <code>README.txt</code> in the folder explains each file and how to
            re-run Soufflé or ask it to explain a tuple by hand; questions asked
            here leave their transcripts in <code>ask/</code>.
          </p>
        </details>
      </div>

      <div className="pane stack">
        <Ask />
      </div>

      {showSource && (
        <div className="pane">
          <div className="pane-head">
            <h3>Source · click a cited id or line</h3>
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
