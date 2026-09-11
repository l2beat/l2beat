import { useCallback, useEffect, useState } from 'react'
import type {
  Inputs,
  RunEvent,
  RunInfo,
  RunRequest,
  UnitInfo,
  UnitSummary,
} from '../../shared/types'
import { api } from '../api'
import { Rows } from '../components/Rows'
import { SolidityView } from '../components/SolidityView'
import { Callout, kib, ms, Panel, Stat } from '../components/ui'
import { AppContext, type AppCtx } from '../lib/context'

const BASE_ORDER = [
  'node',
  'child',
  'attr',
  'num',
  'attrList',
  'numList',
  'loc',
  'text',
  'storageLayout',
  'unit',
]
const DISCOVERY_ORDER = ['dEntry', 'dImpl', 'dUnit', 'dValue']

interface UnitProgress {
  unit: string
  slug: string
  status: 'waiting' | 'running' | 'done' | 'failed'
  ms?: number
  solcVersion?: string
  baseRows?: number
  derivedRows?: number
  error?: string
}

function StartPanel({
  onRunStarted,
  open,
  setOpen,
}: {
  onRunStarted: (run: RunInfo) => void
  open: boolean
  setOpen: (v: boolean) => void
}) {
  const [inputs, setInputs] = useState<Inputs | undefined>()
  const [choice, setChoice] = useState('')
  const [pasteName, setPasteName] = useState('Pasted.sol')
  const [pasteSource, setPasteSource] = useState('')
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<UnitProgress[]>([])
  const [stage, setStage] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  useEffect(() => {
    api
      .inputs()
      .then((i) => {
        setInputs(i)
        const first = i.projects[0]
          ? `project:${i.projects[0].id}`
          : i.fixtures[0]
            ? `fixture:${i.fixtures[0].id}`
            : 'paste'
        setChoice((c) => c || first)
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      )
  }, [])
  const request = (): RunRequest => {
    if (choice === 'paste')
      return { kind: 'paste', name: pasteName, source: pasteSource }
    const [kind, ...rest] = choice.split(':')
    return kind === 'project'
      ? { kind: 'project', id: rest.join(':') }
      : { kind: 'fixture', id: rest.join(':') }
  }
  const start = async () => {
    setRunning(true)
    setError(undefined)
    setProgress([])
    setStage('starting')
    try {
      await api.startRun(request(), (e: RunEvent) => {
        if (e.type === 'plan')
          setStage(`${e.units} file${e.units === 1 ? '' : 's'} to compile`)
        else if (e.type === 'unit') {
          setProgress((prev) => {
            const next = prev.filter((p) => p.slug !== e.slug)
            next.push({
              unit: e.unit,
              slug: e.slug,
              status: e.status,
              ms: e.status === 'done' ? e.ms : undefined,
              solcVersion: e.status === 'done' ? e.solcVersion : undefined,
              baseRows: e.status === 'done' ? e.baseRows : undefined,
              derivedRows: e.status === 'done' ? e.derivedRows : undefined,
              error: e.status === 'failed' ? e.error : undefined,
            })
            return next.sort((a, b) => a.unit.localeCompare(b.unit))
          })
        } else if (e.type === 'project')
          setStage(
            e.status === 'facts'
              ? 'putting the files together with discovery…'
              : 'running the project rules…',
          )
        else if (e.type === 'done') {
          setStage('done')
          onRunStarted(e.run)
        } else if (e.type === 'error') setError(e.message)
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }
  if (!open)
    return (
      <div className="row small start-collapsed">
        <button
          type="button"
          className="btn small"
          onClick={() => setOpen(true)}
        >
          start another run…
        </button>
      </div>
    )
  return (
    <Panel
      title="Start a run"
      actions={
        <button
          type="button"
          className="btn small"
          onClick={() => setOpen(false)}
        >
          hide
        </button>
      }
    >
      <p className="muted">
        A run takes a set of Solidity files (and, for a discovery project, its
        discovered.json), compiles each file with the solc version its pragma
        asks for, writes solc's syntax tree and storage layout down as facts,
        and runs the rule library. Everything lands in one folder under
        out/runs.
      </p>
      <div className="row">
        <select
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          disabled={running}
        >
          {(['synthetic', 'config'] as const).map((where) => {
            const group =
              inputs?.projects.filter((p) => p.where === where) ?? []
            if (group.length === 0) return null
            return (
              <optgroup
                key={where}
                label={
                  where === 'synthetic'
                    ? 'Synthetic projects (projects/ in this spike)'
                    : 'Projects (discovery output in packages/config)'
                }
              >
                {group.map((p) => (
                  <option key={p.id} value={`project:${p.id}`}>
                    {p.name} · {p.contracts} contracts, {p.units} flattened
                    files
                  </option>
                ))}
              </optgroup>
            )
          })}
          {inputs && inputs.fixtures.length > 0 && (
            <optgroup label="Sample contracts">
              {inputs.fixtures.map((f) => (
                <option key={f.id} value={`fixture:${f.id}`}>
                  {f.label} · {f.lines} lines
                </option>
              ))}
            </optgroup>
          )}
          <option value="paste">Paste a contract…</option>
        </select>
        <button
          type="button"
          className="btn primary"
          disabled={
            running || (choice === 'paste' && pasteSource.trim() === '')
          }
          onClick={() => void start()}
        >
          {running ? 'running…' : 'Run: compile → facts → rules'}
        </button>
        {stage && <span className="muted small">{stage}</span>}
      </div>
      {choice === 'paste' && (
        <div className="stack">
          <input
            value={pasteName}
            onChange={(e) => setPasteName(e.target.value)}
            placeholder="File name, e.g. MyContract.sol"
          />
          <textarea
            rows={12}
            value={pasteSource}
            onChange={(e) => setPasteSource(e.target.value)}
            placeholder="// pragma solidity …"
            className="mono"
          />
        </div>
      )}
      {error && <div className="err">{error}</div>}
      {progress.length > 0 && (
        <div className="progress">
          {progress.map((p) => (
            <div key={p.slug} className={`unit-line ${p.status}`}>
              <span className="st">
                {p.status === 'done'
                  ? '✓'
                  : p.status === 'failed'
                    ? '✗'
                    : p.status === 'running'
                      ? '…'
                      : '·'}
              </span>
              <span className="mono">{p.unit}</span>
              {p.status === 'done' && (
                <span className="muted small">
                  solc {p.solcVersion?.split('+')[0]} · {p.baseRows} facts →{' '}
                  {p.derivedRows} tuples · {((p.ms ?? 0) / 1000).toFixed(1)} s
                </span>
              )}
              {p.status === 'failed' && (
                <span className="err small">{p.error?.split('\n')[0]}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

function Source({ runId, slug }: { runId: string; slug: string }) {
  const [text, setText] = useState<string | undefined>()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (open && text === undefined)
      api
        .source(runId, slug)
        .then(setText)
        .catch(() => setText('(could not load)'))
  }, [open, text, runId, slug])
  return (
    <Panel
      title="Source"
      actions={
        <button
          type="button"
          className="btn small"
          onClick={() => setOpen(!open)}
        >
          {open ? 'hide' : 'show'}
        </button>
      }
      tight
    >
      {open && text !== undefined && <SolidityView text={text} />}
      {open && text === undefined && (
        <span className="muted small">loading…</span>
      )}
    </Panel>
  )
}

function RawJson({
  load,
  label,
}: {
  load: () => Promise<string>
  label: string
}) {
  const [text, setText] = useState<string | undefined>()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (open && text === undefined)
      load()
        .then(setText)
        .catch(() => setText('(could not load)'))
  }, [open, text, load])
  const LIMIT = 200_000
  return (
    <>
      <button
        type="button"
        className="btn small"
        onClick={() => setOpen(!open)}
      >
        {open ? 'hide' : 'show'} {label}
      </button>
      {open && text !== undefined && (
        <pre className="json">
          {text.length > LIMIT
            ? `${text.slice(0, LIMIT)}\n… (${kib(text.length - LIMIT)} more; the whole file is in the run folder)`
            : text}
        </pre>
      )}
    </>
  )
}

function UnitView({ runId, unit }: { runId: string; unit: UnitSummary }) {
  const [info, setInfo] = useState<UnitInfo | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [relation, setRelation] = useState('node')
  useEffect(() => {
    setInfo(undefined)
    api
      .unit(runId, unit.slug)
      .then(setInfo)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      )
  }, [runId, unit.slug])
  const load = useCallback(
    (offset: number, filter: string, limit: number) =>
      api.rows(runId, relation, { unit: unit.slug, offset, filter, limit }),
    [runId, relation, unit.slug],
  )
  const loadSolc = useCallback(
    () => api.solc(runId, unit.slug),
    [runId, unit.slug],
  )
  if (error) return <div className="err">{error}</div>
  if (!info)
    return (
      <p className="muted">
        <span className="spinner" /> loading…
      </p>
    )
  const s = info.summary
  return (
    <div className="stack">
      <Panel
        title={
          <>
            <span className="mono">{unit.unit}</span>
            {unit.role && (
              <span className="muted small">
                {' '}
                · {unit.role} code of {unit.entryName} ({unit.address})
              </span>
            )}
          </>
        }
      >
        {s.status === 'failed' ? (
          <Callout kind="warn">
            <b>Compilation failed.</b> <pre className="small">{s.error}</pre>
          </Callout>
        ) : (
          <div className="stats">
            <Stat
              value={s.solcVersion?.split('+')[0] ?? '?'}
              label={`solc (${s.resolvedFrom ?? '?'})`}
            />
            <Stat value={info.solc.astNodes} label="syntax tree nodes" />
            <Stat value={info.storage.length} label="storage slots" />
            <Stat value={s.baseRows ?? 0} label="facts" />
            <Stat
              value={s.derivedRows ?? 0}
              label="tuples derived (layers 1–6)"
            />
            <Stat
              value={
                s.timings
                  ? ms(
                      s.timings.compileMs +
                        s.timings.emitMs +
                        s.timings.souffleMs,
                    )
                  : '?'
              }
              label="compile + facts + Soufflé"
            />
          </div>
        )}
      </Panel>
      <Source runId={runId} slug={unit.slug} />
      {s.status === 'ok' && (
        <Panel
          title="What solc returned"
          actions={
            <RawJson
              load={loadSolc}
              label={`raw JSON (${kib(info.solc.bytes)})`}
            />
          }
        >
          <p className="muted small">
            One standard-JSON call asks for the syntax tree (<code>ast</code>)
            and the storage layout of every contract. The tree has{' '}
            {info.solc.astNodes} nodes; the contracts are{' '}
            {info.solc.contracts.join(', ')}.
            {info.solc.warnings ? ` ${info.solc.warnings} warnings.` : ''}
          </p>
          {info.storage.length > 0 && (
            <table className="tbl small">
              <thead>
                <tr>
                  <th>contract</th>
                  <th>variable</th>
                  <th>slot</th>
                  <th>offset</th>
                  <th>type</th>
                </tr>
              </thead>
              <tbody>
                {info.storage.map((e, i) => (
                  <tr key={i}>
                    <td>{e.contract}</td>
                    <td className="mono">{e.label}</td>
                    <td>{e.slot}</td>
                    <td>{e.offset}</td>
                    <td className="mono">{e.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      )}
      {s.status === 'ok' && (
        <Panel title="The facts: solc's output, written down row by row">
          <p className="muted small">
            Every node becomes <code>node(Id, Type)</code>; every field of a
            node becomes <code>child</code> (another node), <code>attr</code> (a
            string), <code>num</code> (a number) or their list forms;{' '}
            <code>loc</code> and <code>text</code> say where a node is;{' '}
            <code>storageLayout</code> is copied verbatim. Nothing here
            interprets Solidity.
          </p>
          <div className="tabs">
            {BASE_ORDER.map((r) => (
              <button
                type="button"
                key={r}
                className={`tab ${relation === r ? 'active' : ''}`}
                onClick={() => setRelation(r)}
              >
                {r} <span className="muted">{info.factCounts[r] ?? 0}</span>
              </button>
            ))}
          </div>
          <Rows load={load} plain pageSize={200} />
        </Panel>
      )}
    </div>
  )
}

function DiscoveryView({ run }: { run: RunInfo }) {
  const [relation, setRelation] = useState('dEntry')
  const load = useCallback(
    (offset: number, filter: string, limit: number) =>
      api.rows(run.meta.id, relation, { offset, filter, limit }),
    [run.meta.id, relation],
  )
  const loadJson = useCallback(() => api.discovered(run.meta.id), [run.meta.id])
  return (
    <div className="stack">
      <Panel
        title="discovered.json → facts"
        actions={<RawJson load={loadJson} label="discovered.json" />}
      >
        <p className="muted small">
          Discovery's snapshot is written down the same way: one row per address
          (<code>dEntry</code>), per code behind an address (<code>dImpl</code>,{' '}
          <code>dUnit</code>), per recorded value, flattened (
          <code>dValue</code>). Discovery's own permission model is not read: it
          comes from another rule engine, and these rules derive who may do what
          from the code alone.
        </p>
        <div className="tabs">
          {DISCOVERY_ORDER.map((r) => (
            <button
              type="button"
              key={r}
              className={`tab ${relation === r ? 'active' : ''}`}
              onClick={() => setRelation(r)}
            >
              {r} <span className="muted">{run.counts[r] ?? 0}</span>
            </button>
          ))}
        </div>
        <Rows load={load} plain pageSize={200} />
      </Panel>
    </div>
  )
}

export function InputsScreen({
  run,
  runId,
  ctx,
  focusUnit,
  onRunStarted,
  startOpen,
}: {
  run?: RunInfo
  runId?: string
  ctx?: AppCtx
  focusUnit?: string
  onRunStarted: (run: RunInfo) => void
  startOpen: boolean
}) {
  const [open, setOpen] = useState(startOpen)
  const [selected, setSelected] = useState<string>(focusUnit ?? 'discovery')
  useEffect(() => setOpen(startOpen), [startOpen])
  useEffect(() => {
    if (focusUnit) setSelected(focusUnit)
  }, [focusUnit])
  useEffect(() => {
    if (run && run.meta.input.kind === 'file')
      setSelected(run.meta.units[0]?.slug ?? '')
    else if (run)
      setSelected((s) =>
        s && run.meta.units.some((u) => u.slug === s) ? s : 'discovery',
      )
  }, [run])
  const isProject = run?.meta.input.kind === 'project'
  return (
    <div className="screen">
      <StartPanel onRunStarted={onRunStarted} open={open} setOpen={setOpen} />
      {run && runId && ctx && (
        <AppContext.Provider value={ctx}>
          <div className="two-col">
            <div className="side">
              <div className="side-head">
                <b>{run.meta.name}</b>
                <span className="muted small">
                  {run.meta.units.filter((u) => u.status === 'ok').length}/
                  {run.meta.units.length} files · {run.meta.counts.baseRows}{' '}
                  facts
                  {isProject
                    ? ` · ${Object.values(run.meta.counts.discoveryRows).reduce((a, b) => a + b, 0)} discovery facts`
                    : ''}
                </span>
              </div>
              {isProject && (
                <button
                  type="button"
                  className={`side-item ${selected === 'discovery' ? 'active' : ''}`}
                  onClick={() => setSelected('discovery')}
                >
                  <span className="st">◆</span>
                  <span className="mono">discovered.json</span>
                </button>
              )}
              {run.meta.units.map((u) => (
                <button
                  type="button"
                  key={u.slug}
                  className={`side-item ${selected === u.slug ? 'active' : ''}`}
                  onClick={() => setSelected(u.slug)}
                  title={
                    u.entryName ? `${u.role} code of ${u.entryName}` : u.unit
                  }
                >
                  <span className={`st ${u.status}`}>
                    {u.status === 'ok' ? '✓' : '✗'}
                  </span>
                  <span className="mono">{u.unit}</span>
                  <span className="muted small">
                    {u.solcVersion?.split('+')[0]}
                  </span>
                </button>
              ))}
              {run.meta.missing.length > 0 && (
                <div className="muted small side-note">
                  {run.meta.missing.length} contract
                  {run.meta.missing.length === 1 ? '' : 's'} without a flattened
                  file: {run.meta.missing.map((m) => m.entryName).join(', ')}
                </div>
              )}
            </div>
            <div className="content">
              {selected === 'discovery' && isProject && (
                <DiscoveryView run={run} />
              )}
              {selected !== 'discovery' &&
                (() => {
                  const u = run.meta.units.find((x) => x.slug === selected)
                  return u ? <UnitView runId={runId} unit={u} /> : null
                })()}
            </div>
          </div>
        </AppContext.Provider>
      )}
    </div>
  )
}
