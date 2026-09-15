import { useState } from 'react'
import type { ProofNode } from '../../shared/types'

const KIND_LABEL: Record<ProofNode['kind'], string> = {
  derived: 'rule',
  fact: 'fact',
  negation: 'no such tuple',
  constraint: 'check',
  missing: 'not found',
}

/**
 * Soufflé's proof of one tuple, as a tree: a derived node names the rule that fired and unfolds to the
 * tuples it needed; leaves are facts (level 0 rows), negations and arithmetic checks.
 */
export function ProofTree({
  node,
  depth = 0,
}: {
  node: ProofNode
  depth?: number
}) {
  // The first two levels start open, deeper ones closed: a full proof of one write is ~100 lines.
  const [open, setOpen] = useState(depth < 2)
  const [showRule, setShowRule] = useState(false)
  const hasChildren = node.children.length > 0
  return (
    <div className={`proof-node ${node.kind}`}>
      <div className="proof-line">
        {hasChildren ? (
          <button
            type="button"
            className="fold"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className="fold" />
        )}
        <span className={`kind ${node.kind}`}>{KIND_LABEL[node.kind]}</span>
        <code className="atom">{node.text}</code>
        {node.rule && (
          <button
            type="button"
            className="btn tiny"
            onClick={() => setShowRule((v) => !v)}
          >
            {showRule ? 'hide rule' : 'rule'}
          </button>
        )}
      </div>
      {showRule && node.rule && <pre className="rule-text">{node.rule}</pre>}
      {open && hasChildren && (
        <div className="proof-children">
          {node.children.map((c, i) => (
            <ProofTree key={`${c.text}-${i}`} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
