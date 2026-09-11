import { useEffect, useRef, useState } from 'react'
import type {
  ContractChoice,
  ProjectChoice,
  ProjectEvent,
  ProjectInfo,
  ProjectRunResult,
} from '../../shared/types'
import { api } from '../api'
import { SourceView } from '../components/SourceView'
import { Callout, ms } from '../components/ui'

const PASTE = '__paste__'
const DEFAULT_CHOICE = 'fixtures:ClaimSemanticsPlayground.sol'
const PROJECT_PREFIX = 'project:'

export function PipelineFlow({
  onPick,
  enabled,
}: {
  onPick: (step: number) => void
  enabled: boolean
}) {
  const nodes = [
    ['📄', 'Contract', 'one flattened .sol file, or a whole discovery project'],
    ['⚙️', 'Compile', 'solc → AST + storage layout'],
    ['🧱', 'Tree as facts', 'the AST written down as rows, mechanically'],
    ['🔎', 'Concepts', 'rules: function, statement, call, write…'],
    ['📜', 'Rules', 'rules: call graph, writes, sender checks, findings'],
    ['🔁', 'Derive', 'Soufflé computes the unique model'],
    [
      '🌐',
      'Project',
      'rules across contracts: values, proxies, Safes, who can do what',
    ],
  ]
  return (
    <div className="pipeline-flow">
      {nodes.map(([icon, title, desc], i) => (
        <button
          type="button"
          className="node"
          key={title}
          disabled={!enabled && i > 0}
          onClick={() => onPick(i === nodes.length - 1 ? 8 : i + 1)}
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

type UnitState = {
  status: 'running' | 'done' | 'failed'
  ms?: number
  solc?: string
  error?: string
}

export function Step1Contract({
  initial,
  onRun,
  onProjectRun,
  running,
  error,
  hasRun,
  goTo,
}: {
  initial?: { name?: string; source?: string; choice?: string }
  onRun: (name: string, source: string, choice: string) => void
  onProjectRun: (result: ProjectRunResult, choice: string) => Promise<void>
  running: boolean
  error?: string
  hasRun: boolean
  goTo: (step: number) => void
}) {
  const [choices, setChoices] = useState<ContractChoice[]>([])
  const [projects, setProjects] = useState<ProjectChoice[]>([])
  const [choice, setChoice] = useState(initial?.choice ?? DEFAULT_CHOICE)
  const [name, setName] = useState(
    initial?.name ?? 'ClaimSemanticsPlayground.sol',
  )
  const [source, setSource] = useState(initial?.source ?? '')
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<ProjectInfo | undefined>()
  const [progress, setProgress] = useState<Map<string, UnitState>>(new Map())
  const [phase, setPhase] = useState<string | undefined>()
  const [projectRunning, setProjectRunning] = useState(false)
  const [projectError, setProjectError] = useState<string | undefined>()
  const abort = useRef<AbortController | undefined>(undefined)

  const isProject = choice.startsWith(PROJECT_PREFIX)

  useEffect(() => {
    api
      .contracts()
      .then(setChoices)
      .catch(() => setChoices([]))
    api
      .projects()
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [])

  useEffect(() => {
    if (choice.startsWith(PROJECT_PREFIX)) {
      setLoading(true)
      api
        .project(choice.slice(PROJECT_PREFIX.length))
        .then(setInfo)
        .catch((e: unknown) =>
          setProjectError(e instanceof Error ? e.message : String(e)),
        )
        .finally(() => setLoading(false))
      return
    }
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
    setProjectError(undefined)
    if (id === PASTE) {
      setName('Pasted.sol')
      setSource('')
      setEditing(true)
      return
    }
    if (id.startsWith(PROJECT_PREFIX)) return
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

  const runProject = async () => {
    if (!info) return
    setProjectRunning(true)
    setProjectError(undefined)
    setProgress(new Map())
    setPhase('starting')
    const controller = new AbortController()
    abort.current = controller
    try {
      const result = await api.runProject(
        info.id,
        (event: ProjectEvent) => {
          if (event.type === 'unit') {
            setProgress((prev) => {
              const next = new Map(prev)
              next.set(
                event.unit,
                event.status === 'done'
                  ? { status: 'done', ms: event.ms, solc: event.solcVersion }
                  : event.status === 'failed'
                    ? { status: 'failed', error: event.error }
                    : { status: 'running' },
              )
              return next
            })
            setPhase(`units (${event.index + 1}/${info.units.length})`)
          } else if (event.type === 'project')
            setPhase(`project: ${event.status}`)
        },
        controller.signal,
      )
      setPhase('done')
      await onProjectRun(result, choice)
    } catch (e) {
      setProjectError(e instanceof Error ? e.message : String(e))
      setPhase(undefined)
    } finally {
      setProjectRunning(false)
    }
  }

  const groups = [...new Set(choices.map((c) => c.group))]
  const lines = source.split('\n').length

  return (
    <div className="step">
      <div className="intro">
        <h2>📄 Step 1 · Start from a flattened contract, or a whole project</h2>
        <p className="lead">
          This explorer walks the whole road from Solidity text to queryable
          facts, one step at a time. Nothing here is a mock: each step shows the
          real artifact the pipeline produced, and the next step is computed
          from it. A <b>project</b> is a discovery output folder: every
          flattened contract discovery downloaded plus{' '}
          <code>discovered.json</code>, its snapshot of the contracts' values.
          Running a project runs the pipeline once per file and then a second
          rule layer across them.
        </p>
        <PipelineFlow onPick={goTo} enabled={hasRun} />
        <p className="small muted">
          Pick a prepared fixture, a project from{' '}
          <code>packages/config/src/projects</code>, or paste your own file. A
          pasted file must be <i>flattened</i> (a single file, no imports) and
          carry a <code>pragma solidity</code> line so the right compiler can be
          chosen.
        </p>
      </div>

      <div className="row" style={{ marginBottom: 10 }}>
        <label className="row">
          <span>Contract or project</span>
          <select value={choice} onChange={(e) => pick(e.target.value)}>
            {groups.map((g) => (
              <optgroup key={g} label="Spike fixtures">
                {choices
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} · {c.lines} lines
                    </option>
                  ))}
              </optgroup>
            ))}
            <optgroup label="Projects (discovery output in packages/config)">
              {projects.map((p) => (
                <option key={p.id} value={`${PROJECT_PREFIX}${p.id}`}>
                  {p.name} · {p.contracts} contracts, {p.units} files
                </option>
              ))}
              {projects.length === 0 && (
                <option disabled>
                  no project has flattened sources (.flat/)
                </option>
              )}
            </optgroup>
            <optgroup label="Your own">
              <option value={PASTE}>Paste a contract…</option>
            </optgroup>
          </select>
        </label>
        {!isProject && (
          <>
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
          </>
        )}
        <span style={{ flex: 1 }} />
        {isProject ? (
          <button
            type="button"
            className="btn primary"
            disabled={projectRunning || !info}
            onClick={() => void runProject()}
          >
            {projectRunning ? (
              <>
                <span className="spinner" /> {phase ?? 'running'}…
              </>
            ) : (
              `Run the pipeline on the whole project (${info?.units.length ?? '…'} files) ▸`
            )}
          </button>
        ) : (
          <button
            type="button"
            className="btn primary"
            disabled={running || source.trim() === ''}
            onClick={() => onRun(name, source, choice)}
          >
            {running ? (
              <>
                <span className="spinner" /> running compile → emit → Soufflé…
              </>
            ) : hasRun && initial?.source === source ? (
              'Run again ▸'
            ) : (
              'Run the pipeline ▸'
            )}
          </button>
        )}
      </div>

      {error && <div className="err">{error}</div>}
      {projectError && <div className="err">{projectError}</div>}

      {isProject ? (
        <ProjectPanel info={info} loading={loading} progress={progress} />
      ) : editing || source === '' ? (
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
        process) reads each file's pragma, picks the exact <code>solc</code>{' '}
        release it names, compiles with the standard-JSON interface, walks the
        AST into tab-separated fact files, runs Soufflé on the rule library and
        renders a report. For a project it does this once per flattened file,
        writes <code>discovered.json</code> down as facts too, and runs the
        project rules (<code>rules/project.dl</code>) over everything: which
        code runs at which address, what each state variable holds, who passes
        which check, who can change what. Every artifact is written to{' '}
        <code>out/runs/&lt;name&gt;-&lt;timestamp&gt;/</code> so it can be
        inspected, or handed to an AI, later.
      </Callout>
    </div>
  )
}

function ProjectPanel({
  info,
  loading,
  progress,
}: {
  info?: ProjectInfo
  loading: boolean
  progress: Map<string, UnitState>
}) {
  if (loading && !info)
    return (
      <p className="muted">
        <span className="spinner" /> reading discovered.json…
      </p>
    )
  if (!info) return null
  const done = [...progress.values()].filter((p) => p.status === 'done').length
  const failed = [...progress.values()].filter(
    (p) => p.status === 'failed',
  ).length
  return (
    <div className="project-panel">
      <div className="row small muted" style={{ marginBottom: 6 }}>
        <span>
          <b>{info.name}</b> · {info.contracts.length} contracts · {info.eoas}{' '}
          EOAs · {info.units.length} flattened files
          {info.missing.length > 0 &&
            ` · ${info.missing.length} without a source file`}
        </span>
        <span style={{ flex: 1 }} />
        <span className="mono">{info.dir}</span>
        {progress.size > 0 && (
          <span>
            {done} compiled{failed > 0 ? `, ${failed} failed` : ''} of{' '}
            {info.units.length}
          </span>
        )}
      </div>
      <div style={{ maxHeight: 'calc(100vh - 420px)', overflow: 'auto' }}>
        <table className="plain">
          <thead>
            <tr>
              <th>Contract</th>
              <th>Address</th>
              <th>Proxy type</th>
              <th>Template</th>
              <th>Flattened files</th>
            </tr>
          </thead>
          <tbody>
            {info.contracts.map((c) => (
              <tr key={c.address}>
                <td>{c.name}</td>
                <td className="mono">{c.address}</td>
                <td>{c.proxyType}</td>
                <td className="mono small">{c.template}</td>
                <td>
                  {c.units.map((u) => {
                    const p = progress.get(u.unit)
                    return (
                      <div key={u.unit} className="unit-line">
                        <span className={`st ${p?.status ?? ''}`}>
                          {p?.status === 'running' ? (
                            <span className="spinner" />
                          ) : p?.status === 'done' ? (
                            '✓'
                          ) : p?.status === 'failed' ? (
                            '✗'
                          ) : (
                            '·'
                          )}
                        </span>
                        <span className="muted">{u.role}:</span>{' '}
                        <span className="mono">{u.unit}</span>
                        <span className="muted small">
                          {' '}
                          · {(u.bytes / 1024).toFixed(0)} KiB
                          {p?.status === 'done' &&
                            ` · solc ${p.solc?.split('+')[0]} · ${ms(p.ms ?? 0)}`}
                          {p?.status === 'failed' &&
                            ` · ${p.error?.split('\n')[0]}`}
                        </span>
                      </div>
                    )
                  })}
                  {c.units.length === 0 && (
                    <span className="muted">no source file</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
