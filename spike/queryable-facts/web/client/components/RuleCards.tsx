import type {
  ProgramClause,
  ProgramDecl,
  ProgramItem,
} from '../../shared/types'
import { DatalogView } from './DatalogView'

export interface Card {
  decl?: ProgramDecl
  head: string
  clauses: ProgramClause[]
  section: string
}

export interface CardSection {
  section: string
  text: string
  file: string
  cards: Card[]
}

/** Groups program items into: sections, and one card per relation (decl + its clauses). */
export function buildCards(items: ProgramItem[]): CardSection[] {
  const sections: CardSection[] = []
  let current: CardSection = { section: '', text: '', file: '', cards: [] }
  const byHead = new Map<string, Card>()
  for (const item of items) {
    if (item.kind === 'section') {
      if (current.cards.length > 0 || current.section) sections.push(current)
      current = {
        section: item.title,
        text: item.text,
        file: item.file,
        cards: [],
      }
      continue
    }
    if (item.kind === 'decl') {
      const card: Card = {
        decl: item,
        head: item.relation,
        clauses: [],
        section: current.section,
      }
      current.cards.push(card)
      byHead.set(item.relation, card)
      continue
    }
    const card = byHead.get(item.head)
    if (card) card.clauses.push(item)
    else {
      const fresh: Card = {
        head: item.head,
        clauses: [item],
        section: current.section,
      }
      current.cards.push(fresh)
      byHead.set(item.head, fresh)
    }
  }
  sections.push(current)
  return sections
}

/** Commented rule cards, one per relation, grouped under their section banners. */
export function RuleCards({
  sections,
  focus,
  isOutput,
  countOf,
  onJump,
  onShowTuples,
  tuplesLabel = 'derived',
}: {
  sections: CardSection[]
  focus?: string
  isOutput: (name: string) => boolean
  countOf: (name: string) => number
  /** A relation name inside a rule body was clicked. */
  onJump: (name: string) => void
  /** The "N tuples" button of a card was clicked. */
  onShowTuples: (name: string) => void
  tuplesLabel?: string
}) {
  return (
    <>
      {sections.map((s) => (
        <div key={`${s.file}:${s.section}`}>
          <div className="section-head">
            <h3>{s.section}</h3>
            {s.text && <p>{s.text}</p>}
          </div>
          {s.cards.map((card) => {
            const count = countOf(card.head)
            return (
              <div
                className={`rule-card ${focus === card.head ? 'focus' : ''}`}
                key={card.head}
                data-rel={card.head}
              >
                <div className="head">
                  <div className="sig">
                    {card.head}
                    <span className="cols">
                      (
                      {card.decl?.columns
                        .map((c) => `${c.name}: ${c.type}`)
                        .join(', ')}
                      )
                    </span>
                  </div>
                  <div className="right">
                    {isOutput(card.head) && (
                      <span className="tag output">.output</span>
                    )}
                    <span className="muted small">
                      {card.clauses.length} rule
                      {card.clauses.length === 1 ? '' : 's'}
                    </span>
                    <button
                      type="button"
                      className={`btn small ${count > 0 ? '' : 'muted'}`}
                      onClick={() => onShowTuples(card.head)}
                    >
                      {count} tuple{count === 1 ? '' : 's'} {tuplesLabel} →
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
                    {clause.comment && (
                      <div className="why">{clause.comment}</div>
                    )}
                    <DatalogView
                      text={clause.text}
                      firstLine={clause.line}
                      onRelationClick={onJump}
                    />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}
