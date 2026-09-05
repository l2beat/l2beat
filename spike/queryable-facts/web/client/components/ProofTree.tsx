import { useState } from 'react'
import type { ProofNode } from '../../shared/types'
import { useRun } from '../lib/context'
import { DatalogView } from './DatalogView'
import { Cell } from './IdChip'

/** Splits `rel("a", "b", 3)` into its arguments; used for atoms that match no stored row (negations). */
function splitArgs(
  text: string,
): { relation: string; cols: string[] } | undefined {
  const m = /^(\w+)\((.*)\)$/s.exec(text)
  if (!m) return undefined
  const body = m[2] ?? ''
  const cols: string[] = []
  let i = 0
  while (i < body.length) {
    if (body[i] === '"') {
      // a string ends at a quote followed by ", " or the end
      let j = i + 1
      while (
        j < body.length &&
        !(
          body[j] === '"' &&
          (j + 1 === body.length || body.startsWith(', ', j + 1))
        )
      )
        j++
      cols.push(body.slice(i + 1, j))
      i = j + 1
    } else {
      let j = body.indexOf(', ', i)
      if (j < 0) j = body.length
      cols.push(body.slice(i, j))
      i = j
    }
    if (body.startsWith(', ', i)) i += 2
  }
  return { relation: m[1] ?? '', cols }
}

/** One atom, e.g. writes("F", "V"), rendered as relation name + clickable cells when it matches a row. */
export function Atom({ text }: { text: string }) {
  const { index } = useRun()
  const plain = text.replace(/^!/, '')
  const match = index.matchAtom(plain) ?? splitArgs(plain)
  if (!match) return <span className="atom">{text}</span>
  const columns = index.relations.get(match.relation)?.columns ?? []
  return (
    <span className="atom">
      <span className="rn">{match.relation}</span>(
      {match.cols.map((c, i) => (
        <span key={i}>
          <Cell value={c} type={columns[i]?.type} column={columns[i]} />
          {i < match.cols.length - 1 ? ', ' : ''}
        </span>
      ))}
      )
    </span>
  )
}

/** For a base-fact leaf: the source line of the AST node the row is about. */
function Snippet({ text }: { text: string }) {
  const { index, showRange } = useRun()
  const match = index.matchAtom(text)
  if (!match || match.layer !== 'base') return null
  const ref = index.findRow(match.relation, match.cols)
  const range = ref ? index.rangeOfRow(ref) : undefined
  if (!range) return null
  const line = index.lineOf(range.start)
  return (
    <div
      className="snippet"
      onClick={() => showRange(range)}
      style={{ cursor: 'pointer' }}
      title="show in source"
    >
      <span className="l">L{line}</span>
      {index.lineText(line).trim()}
    </div>
  )
}

function relationOf(text: string): string {
  return /^!?(\w+)\(/.exec(text)?.[1] ?? ''
}

function countNodes(node: ProofNode): number {
  return 1 + node.children.reduce((n, c) => n + countNodes(c), 0)
}

export function ProofTree({
  node,
  root = true,
}: {
  node: ProofNode
  root?: boolean
}) {
  const { index } = useRun()
  const [showRule, setShowRule] = useState(false)
  const [open, setOpen] = useState(false)
  if (node.kind === 'missing') {
    return (
      <div className="callout warn">
        Soufflé does not have this tuple (it was not derived).
      </div>
    )
  }
  if (node.kind === 'constraint') return null
  const constraints = node.children.filter((c) => c.kind === 'constraint')
  const others = node.children.filter((c) => c.kind !== 'constraint')
  // Naming and tree-reading helpers (how an id was spelled, which function a node sits in) are
  // true but uninteresting: fold them unless asked.
  const plumbing =
    !root && node.kind === 'derived' && index.plumbing.has(relationOf(node.text))
  if (plumbing && !open) {
    return (
      <div className="pn derived plumbing">
        <div className="line">
          <span className="mark">↳</span>
          <Atom text={node.text} />
          <button
            type="button"
            className="rule-toggle"
            onClick={() => setOpen(true)}
            title="naming / tree-reading helper: expand to see how it was derived"
          >
            plumbing · {countNodes(node) - 1} steps ▸
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className={`pn ${node.kind}`}>
      <div className="line">
        <span className="mark">
          {node.kind === 'derived'
            ? root
              ? '⊢'
              : '↳'
            : node.kind === 'fact'
              ? '●'
              : '∄'}
        </span>
        {node.kind === 'negation' && (
          <span className="muted small">no tuple</span>
        )}
        {node.kind === 'fact' && (
          <span className="muted small">base fact</span>
        )}
        {node.kind === 'derived' &&
          index.layerOf(relationOf(node.text)) === 'concept' && (
            <span className="tag concept">concept</span>
          )}
        <Atom text={node.text} />
        {node.kind === 'derived' && node.rule && (
          <button
            type="button"
            className="rule-toggle"
            onClick={() => setShowRule(!showRule)}
          >
            {showRule ? 'hide rule' : `by rule ${node.ruleNumber ?? ''}`}
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
      {node.kind === 'fact' && <Snippet text={node.text} />}
      {showRule && node.rule && (
        <div className="rule-box">
          <DatalogView text={node.rule} gutter={false} />
        </div>
      )}
      {(others.length > 0 || constraints.length > 0) && (
        <div className="children">
          {others.map((c, i) => (
            <ProofTree key={i} node={c} root={false} />
          ))}
          {constraints.length > 0 && (
            <div
              className="constraints"
              title={constraints.map((c) => c.text).join('\n')}
            >
              ✓ {constraints.length} constant check
              {constraints.length > 1 ? 's' : ''} (equalities on the rule's
              literal values, shown by Soufflé as symbol numbers)
            </div>
          )}
        </div>
      )}
    </div>
  )
}
