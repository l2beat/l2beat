import { useEffect, useMemo, useState } from 'react'
import { childNodes } from '../../../src/ast'
import type { AstNode } from '../../shared/types'
import { useRun } from '../lib/context'

/** A one-word gloss for a node: its name, member, operator, literal, kind or type. */
export function nodeLabel(node: AstNode): string {
  const n = node as Record<string, unknown>
  if (typeof n.name === 'string' && n.name !== '') return n.name
  if (node.nodeType === 'FunctionDefinition' && typeof n.kind === 'string')
    return n.kind
  if (typeof n.memberName === 'string') return `.${n.memberName}`
  if (typeof n.operator === 'string') return n.operator
  if (node.nodeType === 'FunctionCall' && typeof n.kind === 'string')
    return n.kind
  if (node.nodeType === 'Literal') return String(n.value ?? n.hexValue ?? '')
  if (node.nodeType === 'PragmaDirective' && Array.isArray(n.literals))
    return n.literals.join(' ')
  const td = n.typeDescriptions as { typeString?: string } | undefined
  if (node.nodeType.endsWith('TypeName') && td?.typeString) return td.typeString
  return ''
}

export function AstTree({
  selected,
  onSelect,
}: {
  selected?: AstNode
  onSelect: (node: AstNode) => void
}) {
  const { index } = useRun()
  const root = index.run.ast
  const [expanded, setExpanded] = useState<Set<AstNode>>(() => {
    const set = new Set<AstNode>([root])
    for (const c of childNodes(root)) set.add(c)
    return set
  })
  const path = useMemo(
    () => new Set(selected ? index.ancestors(selected) : []),
    [selected, index],
  )

  useEffect(() => {
    if (!selected) return
    setExpanded((prev) => {
      const next = new Set(prev)
      for (const a of index.ancestors(selected)) next.add(a)
      return next
    })
    const el = document.querySelector(
      `[data-ast="${selected.id ?? selected.src}"]`,
    )
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected, index])

  const toggle = (node: AstNode) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(node)) next.delete(node)
      else next.add(node)
      return next
    })

  const render = (node: AstNode): React.ReactNode => {
    const children = [...childNodes(node)]
    const open = expanded.has(node)
    const label = nodeLabel(node)
    const numId = index.numIdOf(node)
    const concepts =
      numId === undefined
        ? undefined
        : index.conceptRowsByNode.get(numId)?.length
    const line = index.lineOf(index.rangeOfNode(node).start)
    const key = typeof node.id === 'number' ? node.id : node.src
    return (
      <div className="node" key={key}>
        <div
          className={`label ${selected === node ? 'selected' : path.has(node) ? 'onpath' : ''}`}
          data-ast={key}
          onClick={() => onSelect(node)}
        >
          <span
            className="tw"
            onClick={(e) => {
              e.stopPropagation()
              if (children.length > 0) toggle(node)
            }}
          >
            {children.length > 0 ? (open ? '▾' : '▸') : '·'}
          </span>
          <span className="nt">{node.nodeType}</span>
          {label && <span className="nm">{label}</span>}
          <span className="meta">
            {typeof node.id === 'number' ? `#${node.id}` : ''} L{line}
          </span>
          {concepts ? (
            <span className="fc" title="concept rows anchored at this node (step 4)">
              {concepts} concept{concepts === 1 ? '' : 's'}
            </span>
          ) : null}
        </div>
        {open && children.length > 0 && (
          <div className="children">{children.map(render)}</div>
        )}
      </div>
    )
  }
  return <div className="tree">{render(root)}</div>
}
