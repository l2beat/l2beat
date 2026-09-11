import { useState } from 'react'
import type { ProofNode } from '../../shared/types'
import { api } from '../api'
import { isPlumbing, useApp } from '../lib/context'
import { AtomText } from './Atom'
import { DatalogView } from './DatalogView'

function relationOf(text: string): string {
  return /^!?(\w+)\(/.exec(text)?.[1] ?? ''
}

function countNodes(node: ProofNode): number {
  return 1 + node.children.reduce((n, c) => n + countNodes(c), 0)
}

const STAGE_LABEL: Record<string, string> = {
  solidity: 'solc fact',
  discovery: 'discovery fact',
  unit: 'derived in the unit stage',
  project: 'derived in the project stage',
  query: 'derived by a query',
}

/**
 * A proof tree. Leaves that Soufflé saw as inputs but that another stage derived carry a button
 * that fetches their own proof and grows the tree in place, so one tree reaches the base facts.
 */
export function ProofTree({
  node,
  root = true,
  ask,
  shown = new Set<string>(),
}: {
  node: ProofNode
  root?: boolean
  ask?: string
  shown?: Set<string>
}) {
  const app = useApp()
  const [showRule, setShowRule] = useState(false)
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<ProofNode | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  if (node.kind === 'missing')
    return (
      <div className="callout warn">
        Soufflé does not have this tuple (it was not derived).
      </div>
    )
  if (node.kind === 'constraint') return null
  const relation = relationOf(node.text)
  const rec = app.relation(relation)
  const constraints = node.children.filter((c) => c.kind === 'constraint')
  const others = node.children.filter((c) => c.kind !== 'constraint')
  const plumbing = !root && node.kind === 'derived' && isPlumbing(rec)
  const repeated = !root && node.kind === 'derived' && shown.has(node.text)
  if (node.kind === 'derived') shown.add(node.text)

  if (expanded)
    return <ProofTree node={expanded} root={false} ask={ask} shown={shown} />

  if (node.kind === 'fact') {
    const derivedElsewhere = rec?.kind === 'derived' || node.stage === 'query'
    return (
      <div className="pn fact">
        <div className="line">
          <span className="mark">●</span>
          <span className="muted small">
            {STAGE_LABEL[node.stage ?? ''] ?? node.stage ?? 'fact'}
          </span>
          <AtomText text={node.text} ask={ask} plain />
          {derivedElsewhere && (
            <button
              type="button"
              className="rule-toggle"
              disabled={loading}
              onClick={() => {
                setLoading(true)
                setError(undefined)
                api
                  .explain({ id: app.runId, atom: node.text, ask })
                  .then((r) => setExpanded(r.proof))
                  .catch((e: unknown) =>
                    setError(e instanceof Error ? e.message : String(e)),
                  )
                  .finally(() => setLoading(false))
              }}
            >
              {loading ? 'asking Soufflé…' : 'why? ▸'}
            </button>
          )}
        </div>
        {error && <div className="err small">{error}</div>}
      </div>
    )
  }
  if (node.kind === 'negation')
    return (
      <div className="pn negation">
        <div className="line">
          <span className="mark">∄</span>
          <span className="muted small">no tuple</span>
          <AtomText text={node.text} plain />
        </div>
      </div>
    )
  if (repeated)
    return (
      <div className="pn derived plumbing">
        <div className="line">
          <span className="mark">↳</span>
          <AtomText text={node.text} ask={ask} plain />
          <span className="muted small">(derived above)</span>
        </div>
      </div>
    )
  if (plumbing && !open)
    return (
      <div className="pn derived plumbing">
        <div className="line">
          <span className="mark">↳</span>
          <AtomText text={node.text} ask={ask} plain />
          <button
            type="button"
            className="rule-toggle"
            onClick={() => setOpen(true)}
            title="naming / tree-reading helper: expand to see how it was derived"
          >
            naming · {countNodes(node) - 1} steps ▸
          </button>
        </div>
      </div>
    )
  return (
    <div className="pn derived">
      <div className="line">
        <span className="mark">{root ? '⊢' : '↳'}</span>
        {node.stage && root && (
          <span className="muted small">
            {STAGE_LABEL[node.stage] ?? node.stage}
          </span>
        )}
        <AtomText text={node.text} ask={ask} plain />
        {node.rule && (
          <button
            type="button"
            className="rule-toggle"
            onClick={() => setShowRule(!showRule)}
          >
            {showRule ? 'hide rule' : `by rule ${node.ruleNumber ?? ''}`}
          </button>
        )}
        {rec && (
          <button
            type="button"
            className="rule-toggle"
            onClick={() => app.showRelation(relation)}
          >
            in the library
          </button>
        )}
        {plumbing && (
          <button
            type="button"
            className="rule-toggle"
            onClick={() => setOpen(false)}
          >
            fold ▾
          </button>
        )}
      </div>
      {showRule && node.rule && (
        <div className="rule-box">
          <DatalogView text={node.rule} gutter={false} />
        </div>
      )}
      {(others.length > 0 || constraints.length > 0) && (
        <div className="children">
          {others.map((c, i) => (
            <ProofTree key={i} node={c} root={false} ask={ask} shown={shown} />
          ))}
          {constraints.length > 0 && (
            <div
              className="constraints"
              title={constraints.map((c) => c.text).join('\n')}
            >
              ✓ {constraints.length} constant check
              {constraints.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
