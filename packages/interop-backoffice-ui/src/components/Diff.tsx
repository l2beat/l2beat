import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'
import { cn } from '../utils/cn'
import { type Difference, diff } from '../utils/getDiff'
import { Badge } from './core/Badge'
import { Card, CardContent } from './core/Card'

interface DiffProps {
  differences: Difference[]
  className?: string
  showPath?: boolean
  maxDepth?: number
}

interface DiffItemProps {
  difference: Difference
  showPath?: boolean
  depth?: number
  maxDepth?: number
}

function formatValue(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()
  if (Array.isArray(value)) return `Array(${value.length})`
  if (typeof value === 'object') return 'Object'
  return String(value)
}

function formatPath(path: (string | number)[]): string {
  return path
    .map((segment, index) => {
      if (typeof segment === 'number') {
        return `[${segment}]`
      }
      return index === 0 ? segment : `.${segment}`
    })
    .join('')
}

function DiffItem({
  difference,
  showPath = true,
  depth = 0,
  maxDepth = 5,
}: DiffItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(depth < 2)

  const pathString = formatPath(difference.path)
  const isNested =
    depth < maxDepth &&
    ((difference.kind === 'change' &&
      typeof difference.lhs === 'object' &&
      difference.lhs !== null) ||
      (difference.kind === 'create' &&
        typeof difference.rhs === 'object' &&
        difference.rhs !== null) ||
      (difference.kind === 'remove' &&
        typeof difference.lhs === 'object' &&
        difference.lhs !== null))

  const getVariant = () => {
    switch (difference.kind) {
      case 'create':
        return 'default'
      case 'remove':
        return 'destructive'
      case 'change':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getIcon = () => {
    switch (difference.kind) {
      case 'create':
        return '+'
      case 'remove':
        return '-'
      case 'change':
        return '~'
      default:
        return '?'
    }
  }

  const getLabel = () => {
    switch (difference.kind) {
      case 'create':
        return 'Added'
      case 'remove':
        return 'Removed'
      case 'change':
        return 'Changed'
      default:
        return 'Unknown'
    }
  }

  const renderValue = (value: unknown, label: string) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div className="ml-4 space-y-1">
          <div className="font-medium text-muted-foreground text-sm">
            {label}:
          </div>
          <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      )
    }

    return (
      <div className="ml-4">
        <span className="font-medium text-muted-foreground text-sm">
          {label}:
        </span>
        <span className="ml-2 font-mono text-sm">{formatValue(value)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant={getVariant()} className="text-xs">
          {getIcon()} {getLabel()}
        </Badge>
        {showPath && pathString && (
          <span className="font-mono text-muted-foreground text-xs">
            {pathString}
          </span>
        )}
        {isNested && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded p-1 hover:bg-muted"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-3 w-3" />
            ) : (
              <ChevronRightIcon className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {difference.kind === 'create' &&
            renderValue(difference.rhs, 'New value')}
          {difference.kind === 'remove' &&
            renderValue(difference.lhs, 'Removed value')}
          {difference.kind === 'change' && (
            <div className="space-y-2">
              {renderValue(difference.lhs, 'Old value')}
              {renderValue(difference.rhs, 'New value')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Diff({
  differences,
  className,
  showPath = true,
  maxDepth = 5,
}: DiffProps) {
  if (differences.length === 0) {
    return (
      <Card className={cn('border-green-200 bg-green-50', className)}>
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-green-700">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-medium text-sm">No changes detected</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const groupedDifferences = differences.reduce(
    (acc, diff) => {
      const key = diff.kind
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(diff)
      return acc
    },
    {} as Record<string, Difference[]>,
  )

  const getSectionTitle = (kind: string, count: number) => {
    switch (kind) {
      case 'create':
        return `Added (${count})`
      case 'remove':
        return `Removed (${count})`
      case 'change':
        return `Changed (${count})`
      default:
        return `${kind} (${count})`
    }
  }

  const getSectionColor = (kind: string) => {
    switch (kind) {
      case 'create':
        return 'border-green-200 bg-green-50'
      case 'remove':
        return 'border-red-200 bg-red-50'
      case 'change':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className={className}>
      {Object.entries(groupedDifferences).map(([kind, diffs]) => (
        <div
          key={kind}
          className={cn(
            'space-y-3 border p-2 text-black first:rounded-t-md last:rounded-b-md',
            getSectionColor(kind),
          )}
        >
          <h3 className="font-semibold text-foreground text-sm">
            {getSectionTitle(kind, (diffs as Difference[]).length)}
          </h3>
          <div className="space-y-3">
            {(diffs as Difference[]).map((diff, index) => (
              <DiffItem
                key={`${kind}-${index}`}
                difference={diff}
                showPath={showPath}
                maxDepth={maxDepth}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Convenience component for displaying a diff between two objects
interface ObjectDiffProps {
  left: unknown
  right: unknown
  className?: string
  showPath?: boolean
  maxDepth?: number
}

export function ObjectDiff({
  left,
  right,
  className,
  showPath = true,
  maxDepth = 5,
}: ObjectDiffProps) {
  const differences = React.useMemo(() => {
    return diff(left, right)
  }, [left, right])

  return (
    <Diff
      differences={differences}
      className={className}
      showPath={showPath}
      maxDepth={maxDepth}
    />
  )
}
