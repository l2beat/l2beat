import { useEffect, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { useIsClient } from '~/hooks/useIsClient'
import { cn } from '~/utils/cn'
import { Logo } from './Logo'

interface JsonTreeNodeProps {
  value: unknown
  depth?: number
  propertyKey?: string
  propertyKeyKind?: 'array' | 'object'
  trailingComma?: boolean
}

const textEncoder = new TextEncoder()

interface SizeMetrics {
  ssrDataBytes: number
  domHtmlBytes: number
  htmlTransferBytes: number | undefined
  pageTransferBytes: number
  resourceCount: number
}

function getSizeMetrics(ssrData: unknown): SizeMetrics {
  const ssrDataJson = JSON.stringify(ssrData)
  const domHtml = document.documentElement.outerHTML
  const navigationEntry = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  const resourceEntries = performance.getEntriesByType(
    'resource',
  ) as PerformanceResourceTiming[]

  const resourceTransferBytes = resourceEntries.reduce((acc, entry) => {
    return acc + entry.transferSize
  }, 0)

  const htmlTransferBytes = navigationEntry?.transferSize
  const pageTransferBytes = (htmlTransferBytes ?? 0) + resourceTransferBytes

  return {
    ssrDataBytes: textEncoder.encode(ssrDataJson).length,
    domHtmlBytes: textEncoder.encode(domHtml).length,
    htmlTransferBytes,
    pageTransferBytes,
    resourceCount: resourceEntries.length,
  }
}

function formatBytes(bytes: number | undefined): string {
  if (bytes === undefined) {
    return 'N/A'
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function MetricWithTooltip({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help underline decoration-dotted underline-offset-2">
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[340px]">{description}</TooltipContent>
      </Tooltip>
      : <span className="text-primary">{value}</span>
    </div>
  )
}

function JsonTreeNode({
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

export function L2BeatDevTools() {
  const isClient = useIsClient()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sizeMetrics, setSizeMetrics] = useState<SizeMetrics | undefined>(
    undefined,
  )

  useEffect(() => {
    if (!copied) {
      return
    }
    const timeout = window.setTimeout(() => {
      setCopied(false)
    }, 1000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [copied])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const updateMetrics = () => {
      setSizeMetrics(getSizeMetrics(window.__SSR_DATA__))
    }

    updateMetrics()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('load', updateMetrics)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('load', updateMetrics)
    }
  }, [isOpen])

  if (!isClient) {
    return null
  }

  const ssrData = window.__SSR_DATA__
  const metrics = sizeMetrics
    ? [
        {
          label: 'SSR JSON',
          value: formatBytes(sizeMetrics.ssrDataBytes),
          description:
            'Byte size of JSON.stringify(window.__SSR_DATA__). Raw/minified SSR props payload.',
        },
        {
          label: 'DOM HTML',
          value: formatBytes(sizeMetrics.domHtmlBytes),
          description:
            'Byte size of document.documentElement.outerHTML at this moment (after hydration/runtime updates).',
        },
        {
          label: 'HTML transfer',
          value: formatBytes(sizeMetrics.htmlTransferBytes),
          description:
            'Transferred network bytes for the main HTML document, including protocol overhead/headers where reported by the browser.',
        },
        {
          label: 'Page transfer',
          value: formatBytes(sizeMetrics.pageTransferBytes),
          description:
            'Approximate total transferred bytes: HTML transfer plus transferSize of all recorded resource entries.',
        },
        {
          label: 'Resources',
          value: String(sizeMetrics.resourceCount),
          description:
            "Number of Performance 'resource' entries included in page totals (scripts, styles, images, fonts, fetch/XHR, etc.).",
        },
      ]
    : undefined

  async function copyData() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(ssrData, null, 2))
      setCopied(true)
    } catch {}
  }

  return (
    <div className={cn('fixed right-3 bottom-16 z-999')}>
      {isOpen && (
        <div className="mb-2 w-[min(92vw,680px)] overflow-hidden rounded-xl border border-divider bg-surface-primary shadow-2xl">
          <div className="flex items-center justify-between border-divider border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <Logo
                animated={false}
                className="h-5 w-auto translate-y-0 overflow-hidden"
              />
              <span className="font-semibold text-2xs text-primary uppercase tracking-[0.08em]">
                L2BEAT DevTools
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSizeMetrics(getSizeMetrics(ssrData))}
                className="rounded border border-divider px-2 py-1 text-3xs text-primary uppercase tracking-[0.08em]"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={copyData}
                className={cn(
                  'rounded border border-divider px-2 py-1 text-3xs text-primary uppercase tracking-[0.08em]',
                  copied && 'border-positive text-positive',
                )}
              >
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded border border-divider px-2 py-1 text-3xs text-primary uppercase tracking-[0.08em]"
              >
                Close
              </button>
            </div>
          </div>
          {sizeMetrics && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-divider border-b bg-background/35 px-3 py-2 font-mono text-3xs text-secondary md:grid-cols-3">
              {metrics?.map((metric) => (
                <MetricWithTooltip
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  description={metric.description}
                />
              ))}
            </div>
          )}
          <div className="max-h-[65vh] overflow-auto bg-background/40 px-3 py-2">
            <JsonTreeNode value={ssrData} />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex size-12 items-center justify-center gap-2 rounded-full border border-divider bg-surface-primary shadow-lg transition-colors hover:bg-surface-primary-hover',
          isOpen && 'hidden',
        )}
      >
        <Logo animated={false} small className="mt-1 mr-px h-6" />
      </button>
    </div>
  )
}
