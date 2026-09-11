import { useMemo, useState } from 'react'
import type { ExplainResult, ProjectRunResult } from '../../shared/types'
import { api } from '../api'
import { Ask } from '../components/Ask'
import { Cite } from '../components/Cite'
import { DatalogView } from '../components/DatalogView'
import { FactsTable } from '../components/FactsTable'
import { Markdown } from '../components/Markdown'
import { ProofTree } from '../components/ProofTree'
import { buildCards, RuleCards } from '../components/RuleCards'
import { Callout, ms, Panel } from '../components/ui'
import { useRun } from '../lib/context'

const TABS: Array<
  [NonNullable<ReturnType<typeof useRun>['nav']['projectTab']>, string, string]
> = [
  ['overview', '🗺 Contracts', 'the deployed contracts, their code, the actors'],
  [
    'discovery',
    '📥 Discovery as facts',
    'layer 0 of the project: discovered.json written down as rows',
  ],
  [
    'rules',
    '📜 Project rules',
    'rules/project.dl: deployment, values, authority',
  ],
  ['derived', '🔁 Derived', 'every project relation, with proofs'],
  [
    'report',
    '📊 Report & ask',
    'report.md for the project, and an AI that answers across contracts',
  ],
]

const HEADLINE = [
  'whoCanWrite',
  'allowed',
  'canCall',
  'crossCall',
  'relayed',
  'valueOf',
  'refersTo',
  'unresolvedCheck',
]

export function Step8Project() {
  const { nav, setNav, project } = useRun()
  if (!project) return null
  const tab = nav.projectTab ?? 'overview'
  const result = project.result
  return (
    <div className="step" style={{ gap: 10 }}>
      <div className="intro" style={{ marginBottom: 0 }}>
        <h2>🌐 Step 8 · The whole project: {result.project}</h2>
        <p className="lead">
          Steps 2–7 looked at one flattened file at a time. Here every unit's
          derived relations meet <code>discovered.json</code>, discovery's
          snapshot of the chain: which code runs at which address (proxies and
          implementations), what every state variable holds right now, who the
          Safes' signers and modules are. A second rule layer (
          <code>rules/project.dl</code>) turns that into: who passes each entry
          point's checks, how actors drive each other, and finally{' '}
          <b>who can change which variable of which contract</b>. Every row
          still has a proof, down to the unit relations and discovery's rows.
        </p>
        <div className="row small muted">
          <span>
            {result.units.filter((u) => u.status === 'ok').length}/
            {result.units.length} units ·{' '}
            {Object.values(result.imported).reduce((a, b) => a + b, 0)} unit
            rows imported ·{' '}
            {result.discovery.reduce((n, d) => n + d.rows.length, 0)} discovery
            rows · {result.derived.reduce((n, d) => n + d.rows.length, 0)}{' '}
            project tuples · Soufflé {ms(result.timings.souffleMs)} · units{' '}
            {(result.timings.unitsMs / 1000).toFixed(1)} s
          </span>
          <span style={{ flex: 1 }} />
          <span className="mono">{result.runDir}</span>
        </div>
      </div>
      <div className="tabs">
        {TABS.map(([id, label, desc]) => (
          <button
            type="button"
            key={id}
            className={`tab ${tab === id ? 'active' : ''}`}
            title={desc}
            onClick={() => setNav({ projectTab: id })}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'overview' && <Overview result={result} />}
      {tab === 'discovery' && <Discovery result={result} />}
      {tab === 'rules' && <Rules result={result} />}
      {tab === 'derived' && <Derived result={result} />}
      {tab === 'report' && <Report result={result} />}
    </div>
  )
}

function shortAddress(a: string): string {
  const m = /^(?:[a-z0-9]+:)?(0x[0-9a-fA-F]{40})$/.exec(a)
  return m?.[1] ? `${m[1].slice(0, 6)}…${m[1].slice(-4)}` : a
}

function rowsOf(result: ProjectRunResult, relation: string): string[][] {
  return (
    result.derived.find((d) => d.relation === relation)?.rows ??
    result.discovery.find((d) => d.relation === relation)?.rows ??
    []
  )
}

function Overview({ result }: { result: ProjectRunResult }) {
  const { project, setNav } = useRun()
  if (!project) return null
  const codeOf = rowsOf(result, 'codeOf')
  const storageAt = rowsOf(result, 'storageAt')
  const entryAt = rowsOf(result, 'entryAt')
  const safes = new Set(rowsOf(result, 'safe').map((r) => r[0]))
  const members = rowsOf(result, 'safeMember')
  const modules = rowsOf(result, 'safeModule')
  const thresholds = new Map(
    rowsOf(result, 'dValue')
      .filter((r) => r[1] === '$threshold')
      .map((r) => [r[0] ?? '', r[4] ?? '?']),
  )
  const label = (id: string) => {
    const u = project.unitOf(id)
    return u ? id.slice(u.length + 1) : id
  }
  const openUnit = (unitName: string) => {
    const slug = result.units.find((u) => u.unit === unitName)?.slug
    if (slug) project.selectUnit(slug, () => setNav({ step: 2 }))
  }
  return (
    <div className="stack">
      <Panel title="Deployed contracts and the code behind them" tight>
        <table className="plain">
          <thead>
            <tr>
              <th>Contract</th>
              <th>Address</th>
              <th>Proxy type</th>
              <th>Code (click a unit to open it in steps 2–7)</th>
              <th>Storage vars</th>
              <th>Entry points</th>
              <th>Safe</th>
            </tr>
          </thead>
          <tbody>
            {result.contracts.map((c) => {
              const codes = codeOf.filter((r) => r[0] === c.address)
              const vars = new Set(
                storageAt.filter((r) => r[0] === c.address).map((r) => r[1]),
              ).size
              const entries = new Set(
                entryAt.filter((r) => r[0] === c.address).map((r) => r[1]),
              ).size
              return (
                <tr key={c.address}>
                  <td>
                    <b>{c.name}</b>
                  </td>
                  <td className="mono small">{c.address}</td>
                  <td>{c.proxyType}</td>
                  <td>
                    {codes.map(([, role = '', code = '']) => (
                      <div key={code}>
                        <span className="muted small">{role}: </span>
                        <button
                          type="button"
                          className="btn link small"
                          onClick={() => openUnit(project.unitOf(code) ?? '')}
                          title={code}
                        >
                          {label(code)}
                        </button>
                      </div>
                    ))}
                    {c.units
                      .filter((u) => u.status !== 'ok')
                      .map((u) => (
                        <div
                          key={u.unit}
                          className="small"
                          style={{ color: 'var(--danger)' }}
                        >
                          {u.role}: {u.unit} failed: {u.error?.split('\n')[0]}
                        </div>
                      ))}
                  </td>
                  <td className="num">{vars}</td>
                  <td className="num">{entries}</td>
                  <td className="small">
                    {safes.has(c.address) && (
                      <>
                        {thresholds.get(c.address)} of{' '}
                        {members.filter((r) => r[0] === c.address).length}{' '}
                        signers
                        {modules.filter((r) => r[0] === c.address).length > 0 &&
                          `, modules: ${modules
                            .filter((r) => r[0] === c.address)
                            .map((r) => project.who(r[1] ?? ''))
                            .join(', ')}`}
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Panel>
      <Callout kind="plain">
        <b>How to read the rest.</b> <i>Discovery as facts</i> is layer 0 of the
        project: nothing there interprets anything. <i>Project rules</i> are
        layers 7–9: deployment (which contract of which unit is the code at an
        address), values (a state variable's discovered value, references
        between contracts), authority (who passes a check, who drives a Safe,
        calls between contracts, reachability, and who can change what).{' '}
        <i>Derived</i> lists every relation they produce; press <b>why?</b> on a
        row for its proof. <i>Report & ask</i> renders <code>report.md</code>{' '}
        and lets an AI answer through <code>./qf</code> in project mode.
      </Callout>
    </div>
  )
}

function Discovery({ result }: { result: ProjectRunResult }) {
  const { nav, setNav } = useRun()
  const relation =
    nav.projectRelation &&
    result.discovery.some((d) => d.relation === nav.projectRelation)
      ? nav.projectRelation
      : 'dEntry'
  const info = result.program.relations.find((r) => r.name === relation)
  const rows = rowsOf(result, relation)
  const [filter, setFilter] = useState('')
  const shown = filter
    ? rows.filter((r) =>
        r.join('\t').toLowerCase().includes(filter.toLowerCase()),
      )
    : rows
  const selected = useMemo(() => {
    const key = nav.projectRow?.join('\t')
    return key === undefined ? -1 : shown.findIndex((r) => r.join('\t') === key)
  }, [shown, nav.projectRow])
  return (
    <div
      className="split"
      style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 10 }}
    >
      <div className="pane">
        <div className="pane-head">
          <h3>Discovery relations</h3>
        </div>
        <div className="side-list">
          {result.discovery.map((d) => (
            <button
              type="button"
              key={d.relation}
              className={`rel ${relation === d.relation ? 'active' : ''} ${d.rows.length === 0 ? 'empty' : ''}`}
              onClick={() =>
                setNav({ projectRelation: d.relation, projectRow: undefined })
              }
            >
              <span>{d.relation}</span>
              <span className="c">{d.rows.length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="pane stack">
        <Panel
          title={
            <span className="mono">
              {relation}({info?.columns.map((c) => c.name).join(', ')})
            </span>
          }
          actions={
            <>
              <input
                type="text"
                placeholder="filter rows…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: 220 }}
              />
              <span className="muted small">
                {shown.length}/{rows.length} rows
              </span>
            </>
          }
          tight
        >
          {info?.comment && (
            <div className="panel-body" style={{ paddingBottom: 0 }}>
              <p className="small" style={{ color: '#3a3f47' }}>
                {info.comment}
              </p>
            </div>
          )}
          <div style={{ maxHeight: 560, overflow: 'auto' }}>
            <FactsTable
              columns={info?.columns ?? []}
              rows={shown}
              selected={selected >= 0 ? selected : undefined}
              limit={Math.max(400, selected + 1)}
            />
          </div>
        </Panel>
        <Callout kind="plain">
          <b>Where this comes from.</b> <code>src/discovery.ts</code> walks{' '}
          <code>discovered.json</code> the way <code>src/emit.ts</code> walks
          the AST: every entry becomes a <code>dEntry</code> row, every piece of
          code behind an address a <code>dImpl</code> row (self, proxy or
          implementation) with its flattened file in <code>dUnit</code>, and
          every recorded value a <code>dValue</code> row, flattened (arrays as{' '}
          <code>[i]</code>, objects as <code>.key</code>) with a kind (address,
          number, boolean, string). <code>dPermission</code> is discovery's own
          permission model, kept only to compare. What a value <i>means</i> is
          the business of the project rules.
        </Callout>
      </div>
    </div>
  )
}

function Rules({ result }: { result: ProjectRunResult }) {
  const { nav, setNav } = useRun()
  const sections = useMemo(
    () =>
      buildCards(result.program.items).filter(
        (s) => s.file === 'project.dl' && s.cards.length > 0,
      ),
    [result.program.items],
  )
  const count = (name: string) => rowsOf(result, name).length
  return (
    <div
      className="split"
      style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 10 }}
    >
      <div className="pane">
        <div className="pane-head">
          <h3>Project rules</h3>
        </div>
        <div className="side-list">
          {sections.map((s) => (
            <div key={s.section}>
              <div className="g">{s.section.split(':')[0]}</div>
              {s.cards.map((c) => (
                <button
                  type="button"
                  key={c.head}
                  className={`rel ${nav.projectFocus === c.head ? 'active' : ''} ${count(c.head) === 0 ? 'empty' : ''}`}
                  onClick={() => {
                    setNav({ projectFocus: c.head })
                    document
                      .querySelector(`[data-rel="${c.head}"]`)
                      ?.scrollIntoView({ block: 'start', behavior: 'smooth' })
                  }}
                >
                  <span>{c.head}</span>
                  <span className="c">{count(c.head)}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        className="pane"
        style={{ maxHeight: 'calc(100vh - 330px)', overflow: 'auto' }}
      >
        <Callout kind="plain">
          <b>Reading these rules.</b> The unit rules (step 5) stop at one file.
          These start from what those produced for every unit plus the discovery
          facts, and never look at syntax again. Layer 7 says which contract is
          the code at an address; layer 8 ties discovery's field names back to
          state variables (a public variable's getter has its name, a view
          function its own, a few are synthesised, such as <code>$members</code>
          ); layer 9 says who passes a check, resolved through those values, and
          follows calls between contracts, calls relayed through Safes by
          modules, and Safe signers, to reachability (<code>canCall</code>) and
          to <code>whoCanWrite</code>. Tiers on <code>allowed</code> say what
          each hop rests on.
        </Callout>
        <RuleCards
          sections={sections}
          focus={nav.projectFocus}
          isOutput={(name) =>
            result.program.relations.find((r) => r.name === name)?.isOutput ??
            false
          }
          countOf={count}
          onJump={(name) => {
            if (
              result.derived.some((d) => d.relation === name) ||
              result.discovery.some((d) => d.relation === name)
            )
              setNav({
                projectTab: 'derived',
                projectRelation: name,
                projectRow: undefined,
              })
            else setNav({ projectFocus: name })
          }}
          onShowTuples={(name) =>
            setNav({
              projectTab: 'derived',
              projectRelation: name,
              projectRow: undefined,
            })
          }
          tuplesLabel="derived"
        />
      </div>
    </div>
  )
}

function Derived({ result }: { result: ProjectRunResult }) {
  const { nav, setNav } = useRun()
  const all = [
    ...result.derived,
    ...result.discovery.map((d) => ({ relation: d.relation, rows: d.rows })),
  ]
  const relation =
    nav.projectRelation && all.some((d) => d.relation === nav.projectRelation)
      ? nav.projectRelation
      : 'whoCanWrite'
  const info = result.program.relations.find((r) => r.name === relation)
  const rows = all.find((d) => d.relation === relation)?.rows ?? []
  const [filter, setFilter] = useState('')
  const [proof, setProof] = useState<
    | { row: number; result?: ExplainResult; error?: string; loading: boolean }
    | undefined
  >()
  const shown = filter
    ? rows.filter((r) =>
        r.join('\t').toLowerCase().includes(filter.toLowerCase()),
      )
    : rows
  const pinned = useMemo(() => {
    const key = nav.projectRow?.join('\t')
    return key === undefined ? -1 : shown.findIndex((r) => r.join('\t') === key)
  }, [shown, nav.projectRow])
  const clauses = result.program.items.filter(
    (i) => i.kind === 'clause' && i.head === relation,
  )
  const groups = useMemo(() => {
    const m = new Map<string, string[]>()
    for (const r of result.program.relations) {
      if (r.isInput) continue
      const list = m.get(r.section) ?? []
      list.push(r.name)
      m.set(r.section, list)
    }
    return [...m.entries()]
  }, [result.program.relations])
  const imported = result.program.relations.filter(
    (r) => r.isInput && !r.name.startsWith('d'),
  )

  const explain = (row: number) => {
    const cols = shown[row]
    if (!cols) return
    setProof({ row, loading: true })
    api
      .explain({ runId: result.runId, relation, cols })
      .then((res) => setProof({ row, result: res, loading: false }))
      .catch((e: unknown) =>
        setProof({
          row,
          error: e instanceof Error ? e.message : String(e),
          loading: false,
        }),
      )
  }
  const isInput = info?.isInput ?? false

  return (
    <div
      className="split"
      style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 10 }}
    >
      <div className="pane">
        <div className="pane-head">
          <h3>Project relations</h3>
        </div>
        <div className="side-list">
          <div className="g">Headline results</div>
          {HEADLINE.map((name) => (
            <RelButton
              key={name}
              name={name}
              active={relation === name}
              count={rowsOf(result, name).length}
              onClick={() => {
                setNav({ projectRelation: name, projectRow: undefined })
                setProof(undefined)
              }}
            />
          ))}
          {groups.map(([section, names]) => (
            <div key={section}>
              <div className="g">{section.split(':')[0]}</div>
              {names.map((name) => (
                <RelButton
                  key={name}
                  name={name}
                  active={relation === name}
                  count={rowsOf(result, name).length}
                  onClick={() => {
                    setNav({ projectRelation: name, projectRow: undefined })
                    setProof(undefined)
                  }}
                />
              ))}
            </div>
          ))}
          <div className="g">Imported from the units</div>
          <p className="small muted" style={{ padding: '0 8px' }}>
            {imported.length} unit relations (function, entryPoint,
            storageWriters, finding, extCall, …) are read as inputs: their rows
            for every unit. Browse them in step 6 of the unit they belong to;{' '}
            <code>./qf rows &lt;relation&gt;</code> lists them across units.
          </p>
        </div>
      </div>
      <div className="pane stack">
        <Panel
          title={
            <span className="mono">
              {relation}({info?.columns.map((c) => c.name).join(', ')})
            </span>
          }
          actions={
            <>
              {info?.isOutput && <span className="tag output">.output</span>}
              {isInput && <span className="tag input">.input</span>}
              <input
                type="text"
                placeholder="filter rows…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: 220 }}
              />
              <span className="muted small">
                {shown.length}/{rows.length} tuples
              </span>
              {!isInput && (
                <button
                  type="button"
                  className="btn small"
                  onClick={() =>
                    setNav({ projectTab: 'rules', projectFocus: relation })
                  }
                >
                  rules →
                </button>
              )}
            </>
          }
          tight
        >
          <div className="panel-body" style={{ paddingBottom: 0 }}>
            {info?.comment && (
              <p className="small" style={{ color: '#3a3f47' }}>
                {info.comment}
              </p>
            )}
            {clauses.length > 0 && (
              <details className="more">
                <summary>
                  the {clauses.length} rule{clauses.length === 1 ? '' : 's'}{' '}
                  that define it
                </summary>
                {clauses.map((c) => (
                  <div key={c.line} style={{ margin: '6px 0' }}>
                    {c.kind === 'clause' && c.comment && (
                      <div
                        className="muted small"
                        style={{ fontStyle: 'italic' }}
                      >
                        {c.comment}
                      </div>
                    )}
                    <DatalogView
                      text={c.kind === 'clause' ? c.text : ''}
                      firstLine={c.line}
                      onRelationClick={(name) => {
                        if (all.some((d) => d.relation === name))
                          setNav({
                            projectRelation: name,
                            projectRow: undefined,
                          })
                      }}
                    />
                  </div>
                ))}
              </details>
            )}
          </div>
          <div style={{ maxHeight: proof ? 300 : 560, overflow: 'auto' }}>
            <FactsTable
              columns={info?.columns ?? []}
              rows={shown}
              selected={proof?.row ?? (pinned >= 0 ? pinned : undefined)}
              limit={Math.max(400, pinned + 1)}
              extraHeader=""
              extra={
                isInput
                  ? undefined
                  : (i) => (
                      <button
                        type="button"
                        className="btn small"
                        onClick={() => explain(i)}
                        disabled={proof?.loading && proof.row === i}
                      >
                        {proof?.loading && proof.row === i ? (
                          <span className="spinner" />
                        ) : (
                          'why?'
                        )}
                      </button>
                    )
              }
            />
          </div>
        </Panel>
        {proof && (
          <Panel
            title={
              <span>
                Why does this tuple hold?{' '}
                {proof.result && (
                  <span className="muted small">
                    (Soufflé answered in {ms(proof.result.ms)})
                  </span>
                )}
              </span>
            }
            actions={
              <button
                type="button"
                className="btn small"
                onClick={() => setProof(undefined)}
              >
                ✕ close
              </button>
            }
          >
            {proof.loading && (
              <p className="muted">
                <span className="spinner" /> re-running Soufflé on the project
                program with provenance tracking…
              </p>
            )}
            {proof.error && <div className="err">{proof.error}</div>}
            {proof.result && (
              <>
                <p className="small muted">
                  The proof stops at the project's inputs: discovery rows (
                  <code>d…</code>) and the relations the units derived. To go
                  below a unit relation, open that unit in step 6 (a unit id in
                  the proof is a link) or ask its <code>./qf explain</code>.
                </p>
                <div className="proof">
                  <ProofTree node={proof.result.proof} />
                </div>
              </>
            )}
          </Panel>
        )}
      </div>
    </div>
  )
}

function Report({ result }: { result: ProjectRunResult }) {
  return (
    <div
      className="split"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(420px, 1.2fr) minmax(420px, 1fr)',
        gap: 10,
      }}
    >
      <div className="pane stack">
        <Panel title="report.md (project)" tight>
          <div
            className="panel-body"
            style={{ maxHeight: 'calc(100vh - 360px)', overflow: 'auto' }}
          >
            <Markdown text={result.report} code={(c) => <Cite text={c} />} />
          </div>
        </Panel>
        <details className="more">
          <summary>
            everything this run produced · {result.files.length} entries in{' '}
            <span className="mono">{result.runDir}</span>
          </summary>
          <ul
            className="mono small"
            style={{ margin: '6px 0 0', paddingLeft: 18, lineHeight: 1.7 }}
          >
            {result.files.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </details>
      </div>
      <div className="pane stack">
        <Ask
          target={{ runId: result.runId, dir: result.runDir, kind: 'project' }}
          suggestions={projectSuggestions(result)}
        />
      </div>
    </div>
  )
}

function projectSuggestions(result: ProjectRunResult): string[] {
  const out: string[] = []
  const deployed = rowsOf(result, 'deployed')
  const values = rowsOf(result, 'valueOf')
  const guardianLike = values.find(
    (r) => /guardian|owner|admin/i.test(r[1] ?? '') && r[2] === 'address',
  )
  if (guardianLike) {
    const name =
      deployed.find((d) => d[0] === guardianLike[0])?.[1] ??
      shortAddress(guardianLike[0] ?? '')
    const v =
      (guardianLike[1] ?? '').split(':').pop()?.split('.').pop() ??
      'this variable'
    out.push(
      `Who can change \`${v}\` of ${name}, and through which contracts and Safes does the authority run?`,
    )
  }
  const safe = rowsOf(result, 'safe')[0]?.[0]
  if (safe) {
    const name = deployed.find((d) => d[0] === safe)?.[1] ?? shortAddress(safe)
    out.push(`What can ${name} do across the project, and who controls it?`)
  }
  out.push(
    'Which storage variables can anyone change without any sender or signature check? List them per contract.',
    'Who can upgrade each proxy, and what has to happen for an upgrade to go through?',
  )
  return out
}

function RelButton({
  name,
  active,
  count,
  onClick,
}: {
  name: string
  active: boolean
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`rel ${active ? 'active' : ''} ${count === 0 ? 'empty' : ''}`}
      onClick={onClick}
    >
      <span>{name}</span>
      <span className="c">{count}</span>
    </button>
  )
}
