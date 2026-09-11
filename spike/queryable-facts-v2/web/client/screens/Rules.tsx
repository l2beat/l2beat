import { useEffect, useMemo, useState } from 'react'
import { buildCards, type CardSection, RuleCard } from '../components/RuleCards'
import { ms, Stat } from '../components/ui'
import { useApp } from '../lib/context'

interface StagedSection extends CardSection {
  stage: 'unit' | 'project'
  tuples: number
}

export function RulesScreen({ focus }: { focus?: string }) {
  const app = useApp()
  const { run } = app
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState<string | undefined>()
  const sections = useMemo<StagedSection[]>(() => {
    const stage = (items: CardSection[], s: 'unit' | 'project') =>
      items
        .filter((sec) => sec.cards.length > 0)
        .map((sec) => ({
          ...sec,
          stage: s,
          tuples: sec.cards.reduce((n, c) => n + (run.counts[c.head] ?? 0), 0),
        }))
    return [
      ...stage(buildCards(run.library.unit.items), 'unit'),
      ...stage(buildCards(run.library.project.items), 'project'),
    ]
  }, [run])
  useEffect(() => {
    if (!focus) return
    const el = document.getElementById(`rel-${focus}`)
    if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [focus])
  const needle = query.trim().toLowerCase()
  const visible = needle
    ? sections
        .map((s) => ({
          ...s,
          cards: s.cards.filter(
            (c) =>
              c.head.toLowerCase().includes(needle) ||
              c.decl?.comment.toLowerCase().includes(needle),
          ),
        }))
        .filter((s) => s.cards.length > 0)
    : current
      ? sections.filter((s) => s.title === current)
      : sections
  const rules =
    run.library.unit.items.filter((i) => i.kind === 'clause').length +
    run.library.project.items.filter((i) => i.kind === 'clause').length
  return (
    <div className="screen two-col">
      <div className="side">
        <div className="side-head">
          <b>The library</b>
          <span className="muted small">
            {run.library.relations.length} relations · {rules} rules
          </span>
        </div>
        <input
          className="side-search"
          placeholder="find a relation…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className={`side-item ${!current && !needle ? 'active' : ''}`}
          onClick={() => {
            setCurrent(undefined)
            setQuery('')
          }}
        >
          <span>all layers</span>
        </button>
        {sections.map((s) => (
          <button
            type="button"
            key={`${s.stage}:${s.title}`}
            className={`side-item ${current === s.title && !needle ? 'active' : ''}`}
            onClick={() => {
              setCurrent(s.title)
              setQuery('')
            }}
            title={s.text}
          >
            <span className={`st stage-${s.stage}`}>
              {s.stage === 'unit' ? '▪' : '▫'}
            </span>
            <span>{s.title}</span>
            <span className="muted small">{s.tuples.toLocaleString()}</span>
          </button>
        ))}
      </div>
      <div className="content">
        <div className="panel intro">
          <div className="panel-body">
            <p>
              One library, read as one list of layers. Soufflé evaluates it in
              two stages: layers 1–6 once per file over that file's facts, then
              layers 7–9 once over the union of the files' exported relations
              and discovery's facts. A relation is{' '}
              <span className="tag exported">exported</span> when it is keyed by
              names (unit-prefixed) rather than by solc node ids, so its rows
              from different files can be put together. Every tuple is
              clickable: Soufflé shows the rule and the tuples it rests on, down
              to the facts.
            </p>
            <div className="stats">
              <Stat
                value={run.meta.counts.baseRows.toLocaleString()}
                label="facts (all files)"
              />
              <Stat
                value={run.meta.counts.unitDerivedRows.toLocaleString()}
                label="tuples derived per file (layers 1–6)"
              />
              <Stat
                value={run.meta.counts.projectDerivedRows.toLocaleString()}
                label="project tuples (layers 7–9)"
              />
              <Stat
                value={`${(run.meta.timings.unitsMs / 1000).toFixed(1)} s`}
                label="files: compile + facts + Soufflé"
              />
              <Stat
                value={ms(run.meta.timings.souffleMs)}
                label="project stage Soufflé"
              />
            </div>
          </div>
        </div>
        {visible.map((s) => (
          <div key={`${s.stage}:${s.title}`} className="section">
            <div className="section-head">
              <h3>
                {s.title}{' '}
                <span className="muted small">
                  · {s.stage} stage · {s.tuples.toLocaleString()} tuples
                </span>
              </h3>
              {s.text && <p className="muted">{s.text}</p>}
            </div>
            {s.cards.map((card) => (
              <RuleCard
                key={card.head}
                card={card}
                rec={app.relation(card.head)}
                count={run.counts[card.head]}
                focus={focus === card.head}
                openByDefault={focus === card.head}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
