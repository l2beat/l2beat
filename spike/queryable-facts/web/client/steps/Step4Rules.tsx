import { useEffect, useMemo, useState } from 'react'
import type {
  ProgramClause,
  ProgramDecl,
  ProgramItem,
} from '../../shared/types'
import { DatalogView } from '../components/DatalogView'
import { Callout, Panel } from '../components/ui'
import { useRun } from '../lib/context'

interface Card {
  decl?: ProgramDecl
  head: string
  clauses: ProgramClause[]
  section: string
}

/** Groups program items into: sections, and one card per derived relation (decl + its clauses). */
function buildCards(
  items: ProgramItem[],
): Array<{ section: string; text: string; file: string; cards: Card[] }> {
  const sections: Array<{
    section: string
    text: string
    file: string
    cards: Card[]
  }> = []
  let current = { section: '', text: '', file: '', cards: [] as Card[] }
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

export function Step4Rules() {
  const { index, nav, setNav } = useRun()
  const program = index.run.program
  const [showText, setShowText] = useState(false)
  const sections = useMemo(() => buildCards(program.items), [program.items])
  const baseNames = new Set(
    program.relations.filter((r) => r.isInput).map((r) => r.name),
  )

  useEffect(() => {
    if (!nav.focusRelation) return
    document
      .querySelector(`[data-rel="${nav.focusRelation}"]`)
      ?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [nav.focusRelation])

  const jump = (name: string) => {
    if (baseNames.has(name))
      setNav({
        step: 3,
        relation: name,
        filterLine: undefined,
        filterNodeId: undefined,
      })
    else setNav({ focusRelation: name })
  }

  const derivedSections = sections.filter((s) =>
    s.cards.some((c) => !baseNames.has(c.head)),
  )

  return (
    <div className="step split" style={{ gridTemplateColumns: '250px 1fr' }}>
      <div className="pane">
        <div className="pane-head">
          <h3>Rule library</h3>
        </div>
        <div className="side-list">
          {derivedSections.map((s) => (
            <div key={s.section}>
              <div className="g">{s.section.split(':')[0]}</div>
              {s.cards
                .filter((c) => !baseNames.has(c.head))
                .map((c) => (
                  <button
                    type="button"
                    key={c.head}
                    className={`rel ${nav.focusRelation === c.head ? 'active' : ''} ${(index.derived.get(c.head)?.length ?? 0) === 0 ? 'empty' : ''}`}
                    onClick={() => setNav({ focusRelation: c.head })}
                  >
                    <span>{c.head}</span>
                    <span className="c">
                      {index.derived.get(c.head)?.length ?? 0}
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pane">
        <div className="intro">
          <h2>📜 Step 4 · Say what follows from the facts: the rules</h2>
          <p className="lead">
            <b>Soufflé</b> is a Datalog engine. A Datalog program is a list of
            rules of the form <code>head :- body.</code>, read as:{' '}
            <i>whenever every atom in the body holds, the head holds too</i>.
            Variables are capitalised, <code>_</code> means "anything",{' '}
            <code>!</code> means "there is no such tuple". Soufflé starts from
            the base facts of step 3 and applies every rule until nothing new
            appears (a fixpoint). There is no search and no guessing: for a
            program like this one — negation only on relations computed earlier,
            no disjunction in heads — there is exactly <b>one</b> answer, the{' '}
            <i>least model</i>: everything that follows from the facts, and
            nothing else.
          </p>
          <details className="more">
            <summary>If you know clingo / answer set programming…</summary>
            <p className="small">
              Clingo computes <i>stable models</i>, and a program may have many
              because choice rules and unstratified negation let it guess.
              Soufflé does not support guessing at all: negation must be
              stratified (a relation may only be negated after it is fully
              computed), so the stable model is unique and coincides with the
              least model shown in step 5. What you gain is speed and
              predictability on millions of facts; what you lose is the ability
              to state "pick one of these".
            </p>
          </details>
          <div className="row small muted">
            <span>
              {program.relations.filter((r) => r.isInput).length} input
              relations
            </span>
            ·
            <span>
              {program.relations.filter((r) => !r.isInput).length} derived
              relations
            </span>
            ·
            <span>
              {program.items.filter((i) => i.kind === 'clause').length} rules
            </span>
            ·
            <button
              type="button"
              className="btn small"
              onClick={() => setShowText(!showText)}
            >
              {showText
                ? 'show as commented cards'
                : 'show program.dl as plain text'}
            </button>
          </div>
        </div>

        {showText ? (
          <Panel title="program.dl — exactly what Soufflé ran" tight>
            <div className="panel-body">
              <DatalogView text={program.text} onRelationClick={jump} />
            </div>
          </Panel>
        ) : (
          <>
            <Panel title="Inputs · the base relations from step 3" tight>
              <div className="panel-body">
                <p className="small muted">
                  <code>schema.dl</code> declares each fact file with typed
                  columns and <code>.input</code>. Click a name to browse its
                  rows.
                </p>
                <table className="plain">
                  <tbody>
                    {program.relations
                      .filter((r) => r.isInput)
                      .map((r) => (
                        <tr key={r.name}>
                          <td>
                            <button
                              type="button"
                              className="btn link mono"
                              onClick={() => jump(r.name)}
                            >
                              {r.name}
                            </button>
                          </td>
                          <td className="mono muted small">
                            ({r.columns.map((c) => c.name).join(', ')})
                          </td>
                          <td className="small">{r.comment}</td>
                          <td className="mono muted small">
                            {index.facts.get(r.name)?.length ?? 0} rows
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            {derivedSections.map((s) => (
              <div key={s.section}>
                <div className="section-head">
                  <h3>{s.section}</h3>
                  {s.text && <p>{s.text}</p>}
                </div>
                {s.cards
                  .filter((c) => !baseNames.has(c.head))
                  .map((card) => {
                    const count = index.derived.get(card.head)?.length ?? 0
                    const info = index.relations.get(card.head)
                    return (
                      <div
                        className={`rule-card ${nav.focusRelation === card.head ? 'focus' : ''}`}
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
                            {info?.isOutput && (
                              <span className="tag output">.output</span>
                            )}
                            <span className="muted small">
                              {card.clauses.length} rule
                              {card.clauses.length === 1 ? '' : 's'}
                            </span>
                            <button
                              type="button"
                              className={`btn small ${count > 0 ? '' : 'muted'}`}
                              onClick={() =>
                                setNav({ step: 5, derivedRelation: card.head })
                              }
                            >
                              {count} tuple{count === 1 ? '' : 's'} derived →
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
                              onRelationClick={jump}
                            />
                          </div>
                        ))}
                      </div>
                    )
                  })}
              </div>
            ))}
          </>
        )}
        <Callout kind="plain">
          <b>Where this lives on disk:</b> <code>rules/schema.dl</code>,{' '}
          <code>rules/lib.dl</code>, <code>rules/report.dl</code>; the
          concatenation Soufflé ran is{' '}
          <code>{index.run.runDir}/program.dl</code>.
        </Callout>
      </div>
    </div>
  )
}
