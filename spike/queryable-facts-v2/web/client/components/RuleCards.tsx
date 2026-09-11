import { useCallback, useState } from 'react'
import type {
  ProgramClause,
  ProgramDecl,
  ProgramItem,
  RelationRecord,
} from '../../shared/types'
import { api } from '../api'
import { useApp } from '../lib/context'
import { DatalogView } from './DatalogView'
import { Rows } from './Rows'

export interface Card {
  decl?: ProgramDecl
  head: string
  clauses: ProgramClause[]
}

export interface CardSection {
  title: string
  text: string
  file: string
  cards: Card[]
}

/** Groups program items into sections, one card per relation (its declaration and its clauses). */
export function buildCards(items: ProgramItem[]): CardSection[] {
  const sections: CardSection[] = []
  let current: CardSection = { title: '', text: '', file: '', cards: [] }
  const byHead = new Map<string, Card>()
  for (const item of items) {
    if (item.kind === 'section') {
      if (current.cards.length > 0 || current.title) sections.push(current)
      current = {
        title: item.title,
        text: item.text,
        file: item.file,
        cards: [],
      }
      continue
    }
    if (item.kind === 'decl') {
      const card: Card = { decl: item, head: item.relation, clauses: [] }
      current.cards.push(card)
      byHead.set(item.relation, card)
      continue
    }
    const card = byHead.get(item.head)
    if (card) card.clauses.push(item)
    else {
      const fresh: Card = { head: item.head, clauses: [item] }
      current.cards.push(fresh)
      byHead.set(item.head, fresh)
    }
  }
  sections.push(current)
  return sections
}

/** One relation: signature, meaning, rules, count; the tuples unfold underneath. */
export function RuleCard({
  card,
  rec,
  count,
  focus,
  openByDefault,
}: {
  card: Card
  rec?: RelationRecord
  count?: number
  focus?: boolean
  openByDefault?: boolean
}) {
  const app = useApp()
  const [open, setOpen] = useState(Boolean(openByDefault))
  const load = useCallback(
    (offset: number, filter: string, limit: number) =>
      api.rows(app.runId, card.head, { offset, filter, limit }),
    [app.runId, card.head],
  )
  const tag =
    rec?.kind === 'input'
      ? 'fact'
      : rec?.stage === 'unit'
        ? rec.exported
          ? 'exported'
          : 'unit-internal'
        : rec?.stage === 'project'
          ? 'project'
          : ''
  return (
    <div
      className={`rule-card ${focus ? 'focus' : ''}`}
      id={`rel-${card.head}`}
      data-rel={card.head}
    >
      <div className="head">
        <div className="sig">
          {card.head}
          <span className="cols">
            ({card.decl?.columns.map((c) => `${c.name}: ${c.type}`).join(', ')})
          </span>
        </div>
        <div className="right">
          {tag && <span className={`tag ${tag}`}>{tag}</span>}
          <span className="muted small">
            {card.clauses.length} rule{card.clauses.length === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            className={`btn small ${count ? '' : 'muted'}`}
            onClick={() => setOpen(!open)}
          >
            {count ?? '?'} tuple{count === 1 ? '' : 's'} {open ? '▾' : '▸'}
          </button>
        </div>
      </div>
      {card.decl?.comment && (
        <div className="comment">
          {card.decl.comment.split('\n').map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      )}
      {card.clauses.map((clause) => (
        <div className="clause" key={clause.line}>
          {clause.comment && <div className="why">{clause.comment}</div>}
          <DatalogView
            text={clause.text}
            firstLine={clause.line}
            onRelationClick={(n) => app.showRelation(n)}
          />
        </div>
      ))}
      {open && (
        <div className="tuples">
          <Rows load={load} emptyText="no tuples derived in this run" />
        </div>
      )}
    </div>
  )
}
