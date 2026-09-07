import { useEffect, useState } from 'react'
import type { AskConfig, AskEvent } from '../../shared/types'
import { api } from '../api'
import {
  askQuestion,
  cancelQuestion,
  resetConversation,
  setModelChoice,
  type Turn,
  useConversation,
} from '../lib/ask'
import { useRun } from '../lib/context'
import type { RunIndex } from '../lib/run'
import { Cite } from './Cite'
import { Markdown } from './Markdown'
import { Callout, Panel } from './ui'

const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max', 'ultra']

/** The ask box of step 7: model and effort, a question, the turns so far. */
export function Ask() {
  const { index } = useRun()
  const run = index.run
  const conversation = useConversation(run.runId)
  const [config, setConfig] = useState<AskConfig>()
  const [configError, setConfigError] = useState<string>()
  const [question, setQuestion] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .askConfig()
      .then((c) => {
        if (!cancelled) setConfig(c)
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setConfigError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const model = conversation.model ?? config?.model
  const effort = conversation.effort ?? config?.effort
  const modelInfo = config?.models.find((m) => m.slug === model)
  const efforts =
    modelInfo && modelInfo.efforts.length > 0 ? modelInfo.efforts : EFFORTS
  const codexError = configError ?? config?.codex.error
  const ready =
    Boolean(config && !codexError && model && effort) && !conversation.running

  const choose = (nextModel: string, nextEffort: string) => {
    const allowed =
      config?.models.find((m) => m.slug === nextModel)?.efforts ?? EFFORTS
    const e = allowed.includes(nextEffort)
      ? nextEffort
      : allowed.includes('high')
        ? 'high'
        : (allowed[allowed.length - 1] ?? nextEffort)
    setModelChoice(run.runId, nextModel, e)
  }

  const submit = (text?: string) => {
    const q = (text ?? question).trim()
    if (!q || !ready || !model || !effort) return
    setQuestion('')
    void askQuestion(run.runId, { question: q, model, effort })
  }

  return (
    <Panel
      title="Ask an AI about this run"
      actions={
        config && !codexError ? (
          <>
            <label className="small">
              model{' '}
              <select
                value={model ?? ''}
                onChange={(e) => choose(e.target.value, effort ?? 'high')}
                disabled={conversation.running}
              >
                {config.models.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.label} · {m.slug}
                  </option>
                ))}
              </select>
            </label>
            <label className="small">
              effort{' '}
              <select
                value={effort ?? ''}
                onChange={(e) => choose(model ?? config.model, e.target.value)}
                disabled={conversation.running}
              >
                {efforts.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </label>
            {conversation.turns.length > 0 && (
              <button
                type="button"
                className="btn small"
                disabled={conversation.running}
                onClick={() => resetConversation(run.runId)}
                title="start a fresh thread; the transcripts stay in the run folder"
              >
                new conversation
              </button>
            )}
          </>
        ) : undefined
      }
      className="ask"
      tight
    >
      <div className="panel-body">
        <p className="small" style={{ color: '#3a3f47' }}>
          The agent is the <code>codex</code> CLI, started in{' '}
          <code>{run.runDir}</code> with the files you just walked through, in a
          sandbox that can write only there. It reads the same CSVs, runs
          Soufflé when it needs a rule that does not exist yet, and is asked to
          cite tuples and source lines. Citations are links: click a relation
          name to see that row in step 6 (or 4, or 3), an id to light it up in
          the source, <code>L25</code> to jump there. A cited tuple this run
          does not contain is{' '}
          <code className="cite unknown">marked like this</code>.
        </p>
        {codexError && (
          <Callout kind="warn">
            <b>codex is not available:</b> {codexError}. Install the codex CLI,
            log in (<code>codex login</code>), or point <code>CODEX</code> at
            the binary and restart <code>pnpm dev</code>.
          </Callout>
        )}
        {!config && !configError && (
          <p className="muted small">
            <span className="spinner" /> checking the codex CLI…
          </p>
        )}
      </div>

      {conversation.turns.length > 0 && (
        <div className="turns">
          {conversation.turns.map((t, i) => (
            <TurnView key={`${t.startedAt}-${i}`} turn={t} />
          ))}
        </div>
      )}

      <div className="panel-body compose">
        {conversation.turns.length === 0 && config && !codexError && (
          <div className="suggest">
            {suggestions(index).map((s) => (
              <button
                type="button"
                key={s}
                className="btn small"
                onClick={() => setQuestion(s)}
                disabled={!ready}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={
            conversation.turns.length > 0
              ? 'Follow up… (same thread, the agent remembers what it found)'
              : 'Ask about this contract… e.g. who can change `value`, and is every writer really guarded?'
          }
          disabled={!config || Boolean(codexError)}
        />
        <div className="row">
          <button
            type="button"
            className="btn primary"
            disabled={!ready || question.trim() === ''}
            onClick={() => submit()}
          >
            {conversation.running ? (
              <>
                <span className="spinner" /> thinking…
              </>
            ) : conversation.turns.length > 0 ? (
              'Ask a follow-up'
            ) : (
              'Ask'
            )}
          </button>
          {conversation.running && (
            <button
              type="button"
              className="btn"
              onClick={() => cancelQuestion(run.runId)}
            >
              cancel
            </button>
          )}
          <span className="muted small">
            <kbd>Ctrl</kbd>+<kbd>Enter</kbd> sends
            {model && effort ? ` · ${model} at ${effort}` : ''}
            {config?.codex.version ? ` · ${config.codex.version}` : ''}
          </span>
        </div>
      </div>
    </Panel>
  )
}

/** Questions worth asking about any run, plus one about a claim this run actually made. */
function suggestions(index: RunIndex): string[] {
  const claims = index.derived.get('writeClaims') ?? []
  const out: string[] = []
  const conditional = claims.find((r) =>
    r[3]?.startsWith('conditionally guarded'),
  )
  if (conditional)
    out.push(
      `Is ${index.shortLabel(conditional[1] ?? '')} really guarded? Who decides whether its msg.sender check runs, and can anyone change ${index.shortLabel(conditional[2] ?? '')}?`,
    )
  out.push(
    'Which storage variables can be changed after deployment, and by whom?',
    'Which entry points let an arbitrary caller modify storage? Check the claims against the code.',
    'Which write claims in the report are too kind or too harsh once you read the code?',
  )
  return out
}

type Activity =
  | {
      kind: 'command'
      id: string
      command: string
      status: string
      exitCode?: number
      output?: string
    }
  | { kind: 'reasoning' | 'note' | 'message'; text: string }

/** Command start/end events merged into one row each; messages and notes in order. */
function fold(events: AskEvent[]): Activity[] {
  const out: Activity[] = []
  for (const e of events) {
    if (e.type === 'command') {
      const existing =
        e.id !== ''
          ? out.find((a) => a.kind === 'command' && a.id === e.id)
          : undefined
      if (existing && existing.kind === 'command') {
        existing.status = e.status
        existing.exitCode = e.exitCode
        existing.output = e.output ?? existing.output
      } else
        out.push({
          kind: 'command',
          id: e.id,
          command: e.command,
          status: e.status,
          exitCode: e.exitCode,
          output: e.output,
        })
    } else if (
      e.type === 'reasoning' ||
      e.type === 'note' ||
      e.type === 'message'
    )
      out.push({ kind: e.type, text: e.text })
  }
  return out
}

function TurnView({ turn }: { turn: Turn }) {
  const running = turn.status === 'running'
  const [open, setOpen] = useState(running)
  useEffect(() => {
    if (!running) setOpen(false)
  }, [running])
  const activity = fold(turn.events).filter(
    (a) => !(a.kind === 'message' && a.text === turn.answer),
  )
  const commands = activity.filter((a) => a.kind === 'command').length
  const usage = turn.usage
  return (
    <div className={`turn ${turn.status}`}>
      <div className="q">
        <span className="who">You</span>
        <span className="text">{turn.question}</span>
        <span className="meta">
          {turn.model} · {turn.effort}
        </span>
      </div>
      {(activity.length > 0 || running) && (
        <details
          className="activity"
          open={open}
          onToggle={(e) => setOpen(e.currentTarget.open)}
        >
          <summary>
            {running && <span className="spinner" />}{' '}
            {running ? 'working' : 'what the agent did'} · {commands} command
            {commands === 1 ? '' : 's'}
            {turn.ms !== undefined && ` · ${(turn.ms / 1000).toFixed(0)} s`}
          </summary>
          {turn.command && (
            <div className="cmdline" title="how codex was started">
              {turn.command}
            </div>
          )}
          {activity.map((a, i) =>
            a.kind === 'command' ? (
              <CommandRow key={a.id || i} item={a} />
            ) : (
              <div key={i} className={a.kind}>
                {a.text}
              </div>
            ),
          )}
        </details>
      )}
      {turn.answer && (
        <div className="answer">
          <Markdown text={turn.answer} code={(c) => <Cite text={c} />} />
        </div>
      )}
      {turn.error && <div className="err turn-err">{turn.error}</div>}
      {!running && (
        <div className="foot">
          {usage && (
            <span>
              tokens: {usage.input_tokens ?? 0} in
              {usage.cached_input_tokens
                ? ` (${usage.cached_input_tokens} cached)`
                : ''}
              , {usage.output_tokens ?? 0} out
            </span>
          )}
          {turn.transcript && (
            <span>
              transcript <code>{turn.transcript}</code> in the run folder
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function CommandRow({
  item,
}: {
  item: Extract<Activity, { kind: 'command' }>
}) {
  const [show, setShow] = useState(false)
  return (
    <div className={`cmd ${item.status}`}>
      <span className="st">
        {item.status === 'running' ? (
          <span className="spinner" />
        ) : item.status === 'completed' ? (
          '✓'
        ) : (
          '✗'
        )}
      </span>
      <code className="c">{item.command}</code>
      <span className="meta">
        {item.exitCode !== undefined && item.exitCode !== 0
          ? `exit ${item.exitCode} `
          : ''}
        {item.output && (
          <button
            type="button"
            className="btn small"
            onClick={() => setShow(!show)}
          >
            {show ? 'hide output' : 'output'}
          </button>
        )}
      </span>
      {show && item.output && <pre>{item.output}</pre>}
    </div>
  )
}
