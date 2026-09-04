import { type ReactNode, useState } from 'react'

/** Keys of AST nodes the extractor actually reads; highlighted so the eye lands on them. */
const USED_KEYS = new Set([
  'id',
  'nodeType',
  'src',
  'name',
  'referencedDeclaration',
  'kind',
  'visibility',
  'stateMutability',
  'stateVariable',
  'storageLocation',
  'operator',
  'linearizedBaseContracts',
  'contractKind',
  'abstract',
  'functionSelector',
  'memberName',
  'mutability',
  'constant',
  'externalReferences',
  'baseFunctions',
  'baseModifiers',
  'typeString',
  'typeIdentifier',
])

export function JsonView({
  value,
  depth = 1,
  markUsed,
}: {
  value: unknown
  /** how many levels start expanded */
  depth?: number
  markUsed?: boolean
}) {
  return (
    <div className="json">
      <Node
        value={value}
        level={0}
        openDepth={depth}
        markUsed={markUsed ?? false}
      />
    </div>
  )
}

function Node({
  value,
  level,
  openDepth,
  markUsed,
  keyName,
}: {
  value: unknown
  level: number
  openDepth: number
  markUsed: boolean
  keyName?: string
}): ReactNode {
  const isNodeObject =
    typeof value === 'object' &&
    value !== null &&
    'nodeType' in (value as object) &&
    level > 0
  const [open, setOpen] = useState(level < openDepth && !isNodeObject)
  if (value === null) return <span className="b">null</span>
  if (typeof value === 'string')
    return <span className="s">{JSON.stringify(value)}</span>
  if (typeof value === 'number') return <span className="n">{value}</span>
  if (typeof value === 'boolean')
    return <span className="b">{String(value)}</span>
  if (Array.isArray(value)) {
    if (value.length === 0) return <span>[]</span>
    return (
      <span>
        <span className="toggle" onClick={() => setOpen(!open)}>
          {open ? '▾' : '▸'} [{value.length}]
        </span>
        {open && (
          <div className="child">
            {value.map((v, i) => (
              <div key={i}>
                <Node
                  value={v}
                  level={level + 1}
                  openDepth={openDepth}
                  markUsed={markUsed}
                />
                {i < value.length - 1 ? ',' : ''}
              </div>
            ))}
          </div>
        )}
      </span>
    )
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    const summary =
      'nodeType' in (value as object)
        ? `${String((value as { nodeType: unknown }).nodeType)}${
            typeof (value as { name?: unknown }).name === 'string'
              ? ` ${String((value as { name: unknown }).name)}`
              : ''
          }`
        : `{${entries.length}}`
    return (
      <span>
        <span className="toggle" onClick={() => setOpen(!open)}>
          {open ? '▾' : '▸'} {open ? '{' : summary}
        </span>
        {open && (
          <>
            <div className="child">
              {entries.map(([k, v]) => (
                <div key={k}>
                  <span
                    className={`k ${markUsed && USED_KEYS.has(k) ? 'used' : ''}`}
                  >
                    "{k}"
                  </span>
                  :{' '}
                  <Node
                    value={v}
                    level={level + 1}
                    openDepth={openDepth}
                    markUsed={markUsed}
                    keyName={k}
                  />
                </div>
              ))}
            </div>
            {'}'}
          </>
        )}
        {keyName === undefined ? null : null}
      </span>
    )
  }
  return <span>{String(value)}</span>
}
