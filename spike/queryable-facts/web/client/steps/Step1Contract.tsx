import { useEffect, useState } from 'react'
import type { ContractChoice } from '../../shared/types'
import { api } from '../api'
import { SourceView } from '../components/SourceView'
import { Callout } from '../components/ui'

const PASTE = '__paste__'
const DEFAULT_CHOICE = 'fixtures:ClaimSemanticsPlayground.sol'

export function PipelineFlow({
  onPick,
  enabled,
}: {
  onPick: (step: number) => void
  enabled: boolean
}) {
  const nodes = [
    ['📄', 'Contract', 'one flattened .sol file'],
    ['⚙️', 'Compile', 'solc → AST + storage layout'],
    ['🧱', 'Extract facts', 'AST → TSV, one file per relation'],
    ['📜', 'Rules', 'Datalog: what follows from the facts'],
    ['🔁', 'Derive', 'Soufflé computes the unique model'],
  ]
  return (
    <div className="pipeline-flow">
      {nodes.map(([icon, title, desc], i) => (
        <button
          type="button"
          className="node"
          key={title}
          disabled={!enabled && i > 0}
          onClick={() => onPick(i + 1)}
        >
          <div className="t">
            <span>{icon}</span>
            <span>{title}</span>
          </div>
          <div className="d">{desc}</div>
          {i < nodes.length - 1 && <span className="arrow">→</span>}
        </button>
      ))}
    </div>
  )
}

export function Step1Contract({
  initial,
  onRun,
  running,
  error,
  hasRun,
  goTo,
}: {
  initial?: { name: string; source: string; choice?: string }
  onRun: (name: string, source: string, choice: string) => void
  running: boolean
  error?: string
  hasRun: boolean
  goTo: (step: number) => void
}) {
  const [choices, setChoices] = useState<ContractChoice[]>([])
  const [choice, setChoice] = useState(initial?.choice ?? DEFAULT_CHOICE)
  const [name, setName] = useState(
    initial?.name ?? 'ClaimSemanticsPlayground.sol',
  )
  const [source, setSource] = useState(initial?.source ?? '')
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api
      .contracts()
      .then(setChoices)
      .catch(() => setChoices([]))
  }, [])

  useEffect(() => {
    if (initial?.source || choice === PASTE) return
    setLoading(true)
    api
      .contract(choice)
      .then((c) => {
        setName(c.name)
        setSource(c.source)
      })
      .finally(() => setLoading(false))
  }, [choice, initial?.source])

  const pick = (id: string) => {
    setChoice(id)
    if (id === PASTE) {
      setName('Pasted.sol')
      setSource('')
      setEditing(true)
      return
    }
    setEditing(false)
    setLoading(true)
    api
      .contract(id)
      .then((c) => {
        setName(c.name)
        setSource(c.source)
      })
      .finally(() => setLoading(false))
  }

  const groups = [...new Set(choices.map((c) => c.group))]
  const lines = source.split('\n').length

  return (
    <div className="step">
      <div className="intro">
        <h2>📄 Step 1 · Start from one flattened contract</h2>
        <p className="lead">
          This explorer walks the whole road from Solidity text to queryable
          facts, one step at a time, on a contract of your choice. Nothing here
          is a mock: each step shows the real artifact the pipeline produced,
          and the next step is computed from it.
        </p>
        <PipelineFlow onPick={goTo} enabled={hasRun} />
        <p className="small muted">
          Pick one of the prepared contracts or paste your own. The file must be{' '}
          <i>flattened</i> (a single file, no imports) and carry a{' '}
          <code>pragma solidity</code> line so the right compiler can be chosen.
        </p>
      </div>

      <div className="row" style={{ marginBottom: 10 }}>
        <label className="row">
          <span>Contract</span>
          <select value={choice} onChange={(e) => pick(e.target.value)}>
            {groups.map((g) => (
              <optgroup
                key={g}
                label={
                  g === 'fixtures'
                    ? 'Spike fixtures'
                    : `${g} (flattened contracts from packages/config)`
                }
              >
                {choices
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} · {c.lines} lines
                    </option>
                  ))}
              </optgroup>
            ))}
            <optgroup label="Your own">
              <option value={PASTE}>Paste a contract…</option>
            </optgroup>
          </select>
        </label>
        <label className="row">
          <span>File name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: 260 }}
          />
        </label>
        <button
          type="button"
          className="btn small"
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Show highlighted' : 'Edit as text'}
        </button>
        <span className="muted small">
          {loading ? (
            <span className="spinner" />
          ) : (
            `${lines} lines · ${(new TextEncoder().encode(source).length / 1024).toFixed(1)} KiB`
          )}
        </span>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="btn primary"
          disabled={running || source.trim() === ''}
          onClick={() => onRun(name, source, choice)}
        >
          {running ? (
            <>
              <span className="spinner" /> running compile → extract → Soufflé…
            </>
          ) : hasRun && initial?.source === source ? (
            'Run again ▸'
          ) : (
            'Run the pipeline ▸'
          )}
        </button>
      </div>

      {error && <div className="err">{error}</div>}

      {editing || source === '' ? (
        <textarea
          className="editor"
          value={source}
          placeholder="// paste a flattened Solidity file here"
          onChange={(e) => setSource(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <SourceView
          text={source}
          lang="solidity"
          style={{ maxHeight: 'calc(100vh - 380px)' }}
        />
      )}

      <Callout kind="plain">
        <b>What happens when you press run.</b> The server (this same dev
        process) reads the pragma, picks the exact <code>solc</code> release it
        names, compiles with the standard-JSON interface, walks the AST into
        tab-separated fact files, runs Soufflé on the rule library and renders a
        report. Every artifact is written to{' '}
        <code>out/runs/&lt;contract&gt;-&lt;timestamp&gt;/</code> so it can be
        inspected, or handed to an AI, later.
      </Callout>
    </div>
  )
}
