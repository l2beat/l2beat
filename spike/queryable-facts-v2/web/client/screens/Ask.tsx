import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  AskConfig,
  AskDetail,
  AskEvent,
  AskRecord,
  QueryResult,
} from '../../shared/types'
import { api } from '../api'
import { AtomText } from '../components/Atom'
import { DatalogView } from '../components/DatalogView'
import { Markdown } from '../components/Markdown'
import { Rows } from '../components/Rows'
import { Callout, Panel } from '../components/ui'
import { parseAtom } from '../lib/atoms'
import { useApp } from '../lib/context'

const PROJECT_SUGGESTIONS = [
  'Who can pause the system through SuperchainConfig.pause, and through which contracts and checks does each path go? Say what bounds the answer.',
  'Who can upgrade the proxies of this project, and through which contracts?',
  'Which single EOA can change a state variable of a deployed contract, directly or as the only signer of a Safe?',
]
const FILE_SUGGESTIONS = [
  'Which entry points can change each storage variable, and what do they check about the sender?',
  'Is there any function without a sender check that writes storage? List them with the variables.',
]

/** One query the agent ran: its rules, what it read, what it derived. */
function QueryCard({ query, ask }: { query: QueryResult; ask: string }) {
  const app = useApp()
  const [promoting, setPromoting] = useState(false)
  const [relation, setRelation] = useState(query.declared[0]?.name ?? '')
  const [description, setDescription] = useState('')
  const [promoted, setPromoted] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  return (
    <div className="query-card">
      <div className="qhead">
        <b className="mono">{query.name}</b>
        <span className={`badge ${query.classification}`}>
          {query.classification}
        </span>
        <span className="muted small">
          {query.level === 'project'
            ? 'project level: joins reviewed relations'
            : `unit level in ${query.units?.length ?? 0} units: reads the syntax tree (${query.unitOnly.join(', ')}); experimental until reviewed`}
          {' · reads '}
          {query.reads.length > 0
            ? query.reads.map((r, i) => (
                <span key={r}>
                  {i > 0 ? ', ' : ''}
                  <button
                    type="button"
                    className="linkish"
                    onClick={() => app.showRelation(r)}
                  >
                    {r}
                  </button>
                </span>
              ))
            : 'nothing from the library'}
          {' · '}
          {Math.round(query.ms)} ms
        </span>
        <span className="grow" />
        {!query.error && (
          <button
            type="button"
            className="btn small"
            onClick={() => setPromoting(!promoting)}
          >
            promote to the library…
          </button>
        )}
      </div>
      <div className="qbody">
        <DatalogView
          text={query.text}
          gutter={false}
          onRelationClick={(n) => app.showRelation(n)}
        />
        {query.error && (
          <Callout kind="warn">
            <pre className="small">{query.error}</pre>
          </Callout>
        )}
        {!query.error &&
          query.outputs.map((rel) => {
            const decl = query.declared.find((d) => d.name === rel)
            const rows = query.rows[rel] ?? []
            return (
              <div className="qrel" key={rel}>
                <b className="mono">{rel}</b>
                <span className="muted small">
                  ({decl?.columns.map((c) => c.name).join(', ')}) ·{' '}
                  {rows.length} row{rows.length === 1 ? '' : 's'}
                </span>
                {rows.length > 0 && (
                  <Rows
                    ask={ask}
                    load={(offset, filter, limit) =>
                      api.rows(app.runId, rel, {
                        ask,
                        query: query.name,
                        offset,
                        filter,
                        limit,
                      })
                    }
                    pageSize={50}
                  />
                )}
              </div>
            )
          })}
        {promoting && (
          <div className="stack promote">
            <p className="muted small">
              Promotion appends these rules to the proposed-rules file of the{' '}
              {query.level} stage in rules/, with your description, and keeps
              the rows derived here as expected tuples. The next run includes
              them; a reviewer moves them into the library proper or deletes
              them.
            </p>
            <div className="row">
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              >
                {query.declared.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
              <input
                className="grow"
                value={description}
                placeholder="What the relation means, in one line (becomes its comment)"
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                type="button"
                className="btn primary small"
                disabled={description.trim() === ''}
                onClick={() =>
                  api
                    .promote({
                      id: app.runId,
                      ask,
                      query: query.name,
                      relation,
                      description,
                    })
                    .then((r) =>
                      setPromoted(
                        `added to rules/${r.file}; ${r.rows} expected rows in ${r.expected}`,
                      ),
                    )
                    .catch((e: unknown) =>
                      setError(e instanceof Error ? e.message : String(e)),
                    )
                }
              >
                promote
              </button>
            </div>
            {promoted && <Callout kind="ok">{promoted}</Callout>}
            {error && <div className="err">{error}</div>}
          </div>
        )}
      </div>
    </div>
  )
}

function CommandCard({
  command,
  status,
  exitCode,
  output,
}: {
  command: string
  status: string
  exitCode?: number
  output?: string
}) {
  const lines = (output ?? '').split('\n')
  const long = lines.length > 14
  const [open, setOpen] = useState(!long)
  return (
    <div className="step-card">
      <div className="step-head" onClick={() => setOpen(!open)}>
        <span>$</span>
        <span className="grow">{command}</span>
        <span className={`status ${status}`}>
          {status === 'running'
            ? 'running…'
            : `${status}${exitCode !== undefined && exitCode !== 0 ? `, exit ${exitCode}` : ''}`}
          {long ? ` · ${lines.length} lines ${open ? '▾' : '▸'}` : ''}
        </span>
      </div>
      {output !== undefined && (open || !long) && (
        <pre>{open ? output : lines.slice(0, 14).join('\n')}</pre>
      )}
    </div>
  )
}

/** The transcript of one ask, live or from disk: plan, steps, queries, answer, citation check. */
function AskView({
  ask,
  events,
  record,
  live,
}: {
  ask: string
  events: AskEvent[]
  record?: AskRecord
  live: boolean
}) {
  const claims =
    record?.claims ??
    events.find(
      (e): e is Extract<AskEvent, { type: 'done' }> => e.type === 'done',
    )?.claims ??
    []
  const claimByText = useMemo(
    () => new Map(claims.map((c) => [c.text, c])),
    [claims],
  )
  // merge command events by id (running → completed)
  const steps: AskEvent[] = []
  const byId = new Map<string, number>()
  for (const e of events) {
    if (e.type === 'command') {
      const at = byId.get(e.id)
      if (at !== undefined) steps[at] = e
      else {
        byId.set(e.id, steps.length)
        steps.push(e)
      }
    } else steps.push(e)
  }
  const lastMessage = [...steps].reverse().find((e) => e.type === 'message')
  const done = steps.find((e) => e.type === 'done')
  const answer =
    record?.answer ??
    (done && lastMessage?.type === 'message' ? lastMessage.text : undefined)
  const code = useCallback(
    (text: string) => {
      const t = text.trim()
      const claim = claimByText.get(t)
      if (!claim && !parseAtom(t)) return <code>{t}</code>
      return <AtomText text={t} ask={ask} status={claim?.status} />
    },
    [claimByText, ask],
  )
  const verified = claims.filter((c) => c.status === 'verified').length
  return (
    <div className="stack">
      <Panel title="What the agent did" tight>
        <div className="steps">
          {steps.map((e, i) => {
            if (e.type === 'reasoning')
              return (
                <p className="thought" key={i}>
                  {e.text}
                </p>
              )
            if (e.type === 'message' && (!answer || e !== lastMessage))
              return (
                <div className="md-inline" key={i}>
                  <Markdown text={e.text} code={code} />
                </div>
              )
            if (e.type === 'command')
              return (
                <CommandCard
                  key={i}
                  command={e.command}
                  status={e.status}
                  exitCode={e.exitCode}
                  output={e.output}
                />
              )
            if (e.type === 'query')
              return <QueryCard key={i} query={e.result} ask={ask} />
            if (e.type === 'note')
              return (
                <p className="muted small" key={i}>
                  {e.text}
                </p>
              )
            if (e.type === 'error')
              return (
                <div className="err" key={i}>
                  {e.message}
                </div>
              )
            return null
          })}
          {live && !done && (
            <p className="muted small">
              <span className="spinner" /> working…
            </p>
          )}
        </div>
      </Panel>
      {answer && (
        <Panel title="Answer">
          <div className="answer">
            <Markdown text={answer} code={code} />
          </div>
        </Panel>
      )}
      {done && (
        <Panel title="Evidence check">
          <p className="small">
            {claims.length === 0 ? (
              'The answer cites no tuple.'
            ) : (
              <>
                <b>
                  {verified} of {claims.length}
                </b>{' '}
                cited atoms exist in this run's tuples (the library's or this
                ask's queries). Click any of them for its proof.
              </>
            )}
            {done.type === 'done' && (
              <span className="muted">
                {' '}
                · {(done.ms / 1000).toFixed(0)} s
                {done.usage
                  ? ` · tokens ${Object.entries(done.usage)
                      .map(([k, v]) => `${k.replace(/_tokens$/, '')}=${v}`)
                      .join(', ')}`
                  : ''}
              </span>
            )}
          </p>
          {claims.some((c) => c.status !== 'verified') && (
            <div className="claims">
              {claims
                .filter((c) => c.status !== 'verified')
                .map((c) => (
                  <div key={c.text} className="row small">
                    <span className="err">
                      {c.status === 'missing'
                        ? 'not in the run:'
                        : 'unknown relation:'}
                    </span>
                    <AtomText text={c.text} ask={ask} plain status={c.status} />
                  </div>
                ))}
            </div>
          )}
        </Panel>
      )}
    </div>
  )
}

export function AskScreen() {
  const app = useApp()
  const [asks, setAsks] = useState<AskRecord[]>([])
  const [config, setConfig] = useState<AskConfig | undefined>()
  const [selected, setSelected] = useState<string | undefined>()
  const [detail, setDetail] = useState<AskDetail | undefined>()
  const [question, setQuestion] = useState('')
  const [model, setModel] = useState('')
  const [effort, setEffort] = useState('')
  const [live, setLive] = useState<
    { ask?: string; events: AskEvent[] } | undefined
  >()
  const [error, setError] = useState<string | undefined>()
  const abort = useRef<AbortController | undefined>(undefined)
  const isProject = app.run.meta.input.kind === 'project'

  const refresh = useCallback(async () => {
    const list = await api.asks(app.runId)
    setAsks(list)
    return list
  }, [app.runId])
  useEffect(() => {
    refresh()
      .then((list) => setSelected((s) => s ?? list.at(-1)?.ask))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      )
    api
      .askConfig()
      .then((c) => {
        setConfig(c)
        setModel((m) => m || c.model)
        setEffort((e) => e || c.effort)
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      )
  }, [refresh])
  useEffect(() => {
    if (!selected || live?.ask === selected) return
    api
      .askDetail(app.runId, selected)
      .then(setDetail)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      )
  }, [selected, app.runId, live?.ask])

  const submit = async () => {
    const q = question.trim()
    if (!q) return
    setError(undefined)
    setLive({ events: [] })
    setDetail(undefined)
    abort.current = new AbortController()
    try {
      await api.ask(
        { id: app.runId, question: q, model, effort },
        (e) => {
          setLive((prev) => ({
            ask: e.type === 'started' ? e.ask : prev?.ask,
            events: [...(prev?.events ?? []), e],
          }))
          if (e.type === 'started') setSelected(e.ask)
        },
        abort.current.signal,
      )
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError'))
        setError(e instanceof Error ? e.message : String(e))
    } finally {
      const list = await refresh().catch(() => [] as AskRecord[])
      const finished = live?.ask ?? list.at(-1)?.ask
      setLive(undefined)
      if (finished) {
        setSelected(finished)
        api
          .askDetail(app.runId, finished)
          .then(setDetail)
          .catch(() => undefined)
      }
      setQuestion('')
    }
  }
  const models = config?.models ?? []
  const efforts = models.find((m) => m.slug === model)?.efforts ?? [
    'low',
    'medium',
    'high',
    'xhigh',
  ]
  return (
    <div className="screen two-col">
      <div className="side">
        <div className="side-head">
          <b>Ask</b>
          <span className="muted small">
            the agent answers by writing rules and citing tuples
          </span>
        </div>
        <div className="ask-form stack">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="A question about this run…"
            disabled={Boolean(live)}
          />
          <div className="row small">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={Boolean(live)}
            >
              {models.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              value={effort}
              onChange={(e) => setEffort(e.target.value)}
              disabled={Boolean(live)}
            >
              {efforts.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            {live ? (
              <button
                type="button"
                className="btn small"
                onClick={() => abort.current?.abort()}
              >
                stop
              </button>
            ) : (
              <button
                type="button"
                className="btn primary small"
                disabled={
                  question.trim() === '' ||
                  !config ||
                  Boolean(config.codex.error)
                }
                onClick={() => void submit()}
              >
                ask
              </button>
            )}
          </div>
          {config?.codex.error && (
            <div className="err small">{config.codex.error}</div>
          )}
          <div className="suggestions">
            {(isProject ? PROJECT_SUGGESTIONS : FILE_SUGGESTIONS).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setQuestion(s)}
                disabled={Boolean(live)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {asks.length > 0 && (
          <div className="side-head" style={{ marginTop: 8 }}>
            <b>Questions asked</b>
          </div>
        )}
        {[...asks].reverse().map((a) => (
          <button
            type="button"
            key={a.ask}
            className={`side-item ask-item ${selected === a.ask ? 'active' : ''}`}
            onClick={() => setSelected(a.ask)}
            title={a.question}
          >
            <span className="st">{a.ask}</span>
            <span className="q">{a.question}</span>
            <span className="muted small">
              {a.claims.filter((c) => c.status === 'verified').length}/
              {a.claims.length}
            </span>
          </button>
        ))}
      </div>
      <div className="content">
        <div className="panel intro">
          <div className="panel-body">
            <p>
              The agent (the codex CLI, sandboxed to the run folder) receives
              the catalogue of relations and one way to make a claim: write
              Datalog rules, run them with <code>./q run</code>, cite the
              tuples. Every query it writes is kept with its results; every atom
              the answer cites is checked against the run's tuples; rules that
              only join library relations are compositions, rules that read the
              syntax tree are interpretations. A useful rule can be promoted
              into the library.
            </p>
          </div>
        </div>
        {error && <div className="err">{error}</div>}
        {live && live.ask && (
          <AskView ask={live.ask} events={live.events} live />
        )}
        {live && !live.ask && (
          <p className="muted">
            <span className="spinner" /> starting the agent…
          </p>
        )}
        {!live && detail && selected && (
          <>
            <Panel title={`Question ${selected}`}>
              <p>{detail.record.question}</p>
              <p className="muted small">
                {detail.record.model} · effort {detail.record.effort} ·{' '}
                {(detail.record.ms / 1000).toFixed(0)} s ·{' '}
                {new Date(detail.record.createdAt).toLocaleString()}
              </p>
            </Panel>
            <AskView
              ask={selected}
              events={detail.events}
              record={detail.record}
              live={false}
            />
          </>
        )}
        {!live && !detail && asks.length === 0 && (
          <p className="muted">No question asked on this run yet.</p>
        )}
      </div>
    </div>
  )
}
