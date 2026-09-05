import { useEffect, useMemo, useState } from 'react'
import { DatalogView } from '../components/DatalogView'
import { buildCards, RuleCards } from '../components/RuleCards'
import { Callout, Panel } from '../components/ui'
import { useRun } from '../lib/context'
import { CONCEPT_GROUPS } from './Step4Concepts'

export function Step5Rules() {
  const { index, nav, setNav } = useRun()
  const program = index.run.program
  const [showText, setShowText] = useState(false)
  const sections = useMemo(
    () =>
      buildCards(program.items).filter(
        (s) =>
          (s.file === 'lib.dl' || s.file === 'report.dl') &&
          s.cards.length > 0,
      ),
    [program.items],
  )
  const conceptNames = CONCEPT_GROUPS.flatMap(([, names]) => names)

  useEffect(() => {
    if (!nav.focusRelation) return
    document
      .querySelector(`[data-rel="${nav.focusRelation}"]`)
      ?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [nav.focusRelation])

  const jump = (name: string) => {
    if (index.base.has(name)) setNav({ step: 3, baseRelation: name })
    else if (index.concepts.has(name))
      setNav({
        step: 4,
        relation: name,
        filterLine: undefined,
        filterNodeId: undefined,
        focusRelation: undefined,
      })
    else setNav({ focusRelation: name })
  }

  const ruleCount = (file: string) =>
    program.items.filter((i) => i.kind === 'clause' && i.file === file).length

  return (
    <div className="step split" style={{ gridTemplateColumns: '250px 1fr' }}>
      <div className="pane">
        <div className="pane-head">
          <h3>Rule library</h3>
        </div>
        <div className="side-list">
          {sections.map((s) => (
            <div key={`${s.file}:${s.section}`}>
              <div className="g">{s.section.split(':')[0]}</div>
              {s.cards.map((c) => (
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
          <h2>📜 Step 5 · Say what follows from the concepts: the analysis rules</h2>
          <p className="lead">
            <b>Soufflé</b> is a Datalog engine. A Datalog program is a list of
            rules of the form <code>head :- body.</code>, read as:{' '}
            <i>whenever every atom in the body holds, the head holds too</i>.
            Variables are capitalised, <code>_</code> means "anything",{' '}
            <code>!</code> means "there is no such tuple". Soufflé starts from
            the base facts of step 3, derives the concepts of step 4, then
            applies the rules on this page until nothing new appears (a
            fixpoint). There is no search and no guessing: for a program like
            this one — negation only on relations computed earlier, no
            disjunction in heads — there is exactly <b>one</b> answer, the{' '}
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
              least model shown in step 6. What you gain is speed and
              predictability on millions of facts; what you lose is the ability
              to state "pick one of these".
            </p>
          </details>
          <div className="row small muted">
            <span>{ruleCount('concepts.dl')} rules in layer 1 (step 4)</span>·
            <span>
              {ruleCount('lib.dl') + ruleCount('report.dl')} rules on this page
            </span>
            ·
            <span>
              {program.relations.filter((r) => !r.isInput).length} derived
              relations in total
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
            <Panel title="Inputs of this layer · the concept relations from step 4" tight>
              <div className="panel-body">
                <p className="small muted">
                  The rules below never touch the raw tree: they read the
                  concepts of step 4, which are themselves derived. Click a name
                  to browse its rows and its own rules.
                </p>
                <table className="plain">
                  <tbody>
                    {conceptNames
                      .filter((n) => index.relations.has(n))
                      .map((n) => {
                        const r = index.relations.get(n)
                        return (
                          <tr key={n}>
                            <td>
                              <button
                                type="button"
                                className="btn link mono"
                                onClick={() => jump(n)}
                              >
                                {n}
                              </button>
                            </td>
                            <td className="mono muted small">
                              ({r?.columns.map((c) => c.name).join(', ')})
                            </td>
                            <td className="small">
                              {r?.comment.split('\n')[0]}
                            </td>
                            <td className="mono muted small">
                              {index.concepts.get(n)?.length ?? 0} rows
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </Panel>

            <RuleCards
              sections={sections}
              focus={nav.focusRelation}
              isOutput={(n) => index.relations.get(n)?.isOutput ?? false}
              countOf={(n) => index.derived.get(n)?.length ?? 0}
              onJump={jump}
              onShowTuples={(n) => setNav({ step: 6, derivedRelation: n })}
            />
          </>
        )}
        <Callout kind="plain">
          <b>Where this lives on disk:</b> <code>rules/schema.dl</code> (layer
          0), <code>rules/concepts.dl</code> (layer 1),{' '}
          <code>rules/lib.dl</code> (layers 2–5), <code>rules/report.dl</code>;
          the concatenation Soufflé ran is{' '}
          <code>{index.run.runDir}/program.dl</code>.
        </Callout>
      </div>
    </div>
  )
}
