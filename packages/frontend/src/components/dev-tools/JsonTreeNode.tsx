import { useState } from 'react'

interface JsonTreeNodeProps {
  value: unknown
  depth?: number
  propertyKey?: string
  propertyKeyKind?: 'array' | 'object'
  trailingComma?: boolean
}

export function JsonTreeNode({
  value,
  depth = 0,
  propertyKey,
  propertyKeyKind = 'object',
  trailingComma = false,
}: JsonTreeNodeProps) {
  const [isCollapsed, setIsCollapsed] = useState(depth > 0)
  const isArray = Array.isArray(value)
  const isObject = typeof value === 'object' && value !== null
  const entries = isObject
    ? isArray
      ? value.map((entry, index) => [String(index), entry] as const)
      : Object.entries(value)
    : []
  const hasChildren = entries.length > 0
  const comma = trailingComma ? ',' : ''

  if (!isObject) {
    return (
      <div className="font-mono text-2xs text-primary leading-5">
        <PropertyKey propertyKey={propertyKey} kind={propertyKeyKind} />
        <PrimitiveValue value={value} />
        <span className="text-secondary">{comma}</span>
      </div>
    )
  }

  const openingBracket = isArray ? '[' : '{'
  const closingBracket = isArray ? ']' : '}'

  if (!hasChildren) {
    return (
      <div className="font-mono text-2xs text-primary leading-5">
        <PropertyKey propertyKey={propertyKey} kind={propertyKeyKind} />
        <span>
          {openingBracket}
          {closingBracket}
        </span>
        <span className="text-secondary">{comma}</span>
      </div>
    )
  }

  return (
    <div className="font-mono text-2xs text-primary leading-5">
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="flex items-center gap-1 text-left"
      >
        <span className="inline-block w-3 text-secondary">
          {isCollapsed ? '▸' : '▾'}
        </span>
        <PropertyKey propertyKey={propertyKey} kind={propertyKeyKind} />
        <span>{openingBracket}</span>
        {isCollapsed && (
          <>
            <span className="text-secondary">
              {isArray ? `${entries.length} items` : `${entries.length} keys`}
            </span>
            <span>{closingBracket}</span>
            <span className="text-secondary">{comma}</span>
          </>
        )}
      </button>
      {!isCollapsed && (
        <>
          <div className="ml-5 border-divider border-l pl-3">
            {entries.map(([entryKey, entryValue], index) => (
              <JsonTreeNode
                key={`${depth}-${entryKey}`}
                value={entryValue}
                depth={depth + 1}
                propertyKey={entryKey}
                propertyKeyKind={isArray ? 'array' : 'object'}
                trailingComma={index < entries.length - 1}
              />
            ))}
          </div>
          <div>
            {closingBracket}
            <span className="text-secondary">{comma}</span>
          </div>
        </>
      )}
    </div>
  )
}

function PropertyKey({
  propertyKey,
  kind,
}: {
  propertyKey?: string
  kind: 'array' | 'object'
}) {
  if (propertyKey === undefined) {
    return null
  }

  if (kind === 'array') {
    return <span className="text-secondary">{`[${propertyKey}] `}</span>
  }

  return <span className="text-link">{`${JSON.stringify(propertyKey)}: `}</span>
}

function PrimitiveValue({ value }: { value: unknown }) {
  if (typeof value === 'string') {
    return <span className="text-positive">{JSON.stringify(value)}</span>
  }

  if (typeof value === 'number') {
    return <span className="text-brand">{value}</span>
  }

  if (typeof value === 'boolean') {
    return <span className="text-warning">{String(value)}</span>
  }

  if (value === null) {
    return <span className="text-secondary">null</span>
  }

  if (typeof value === 'undefined') {
    return <span className="text-secondary">undefined</span>
  }

  return <span className="text-secondary">{String(value)}</span>
}
