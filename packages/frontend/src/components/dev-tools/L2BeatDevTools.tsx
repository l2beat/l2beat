import { useEffect, useMemo, useState } from 'react'
import { useIsClient } from '~/hooks/useIsClient'
import { cn } from '~/utils/cn'
import { Logo } from '../Logo'
import { readJsonLd, readOpenGraph } from './headTags'
import { JsonLdViewer } from './JsonLdViewer'
import { JsonTreeNode } from './JsonTreeNode'
import { MetricWithTooltip } from './MetricWithTooltip'
import { getDevToolsMetrics } from './metrics'
import { OpenGraphPreview } from './OpenGraphPreview'
import { getSizeMetrics, type SizeMetrics } from './sizeMetrics'

export function L2BeatDevTools() {
  const isClient = useIsClient()
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('ssr-data')
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

  const headTags = useMemo(
    () =>
      isOpen
        ? {
            openGraph: readOpenGraph(document.head),
            jsonLd: readJsonLd(document.head),
          }
        : undefined,
    [isOpen],
  )

  if (!isClient) {
    return null
  }

  const ssrData = window.__SSR_DATA__
  const metrics = sizeMetrics ? getDevToolsMetrics(sizeMetrics) : []

  const copyableJson =
    tab === 'ssr-data'
      ? ssrData
      : tab === 'json-ld'
        ? headTags?.jsonLd.map((block) =>
            block.isValid ? block.data : block.raw,
          )
        : undefined

  async function copyData() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(copyableJson, null, 2))
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
                DevTools
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/dev/icons"
                className="rounded border border-divider px-2 py-1 text-3xs text-primary uppercase tracking-[0.08em]"
              >
                Icons
              </a>
              {tab === 'ssr-data' && (
                <button
                  type="button"
                  onClick={() => setSizeMetrics(getSizeMetrics(ssrData))}
                  className="rounded border border-divider px-2 py-1 text-3xs text-primary uppercase tracking-[0.08em]"
                >
                  Refresh
                </button>
              )}
              {copyableJson !== undefined && (
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
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded border border-divider px-2 py-1 text-3xs text-primary uppercase tracking-[0.08em]"
              >
                Close
              </button>
            </div>
          </div>
          <div className="flex gap-1 border-divider border-b px-3 py-1.5">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  'rounded px-2 py-1 text-3xs text-secondary uppercase tracking-[0.08em]',
                  tab === id && 'bg-surface-secondary text-primary',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === 'ssr-data' && sizeMetrics && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-divider border-b bg-background/35 px-3 py-2 font-mono text-3xs text-secondary md:grid-cols-3">
              {metrics.map((metric) => (
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
            {tab === 'ssr-data' && <JsonTreeNode value={ssrData} />}
            {tab === 'og-preview' && headTags && (
              <OpenGraphPreview tags={headTags.openGraph} />
            )}
            {tab === 'json-ld' && headTags && (
              <JsonLdViewer blocks={headTags.jsonLd} />
            )}
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

type Tab = (typeof TABS)[number]['id']

const TABS = [
  { id: 'ssr-data', label: 'SSR data' },
  { id: 'og-preview', label: 'OG preview' },
  { id: 'json-ld', label: 'JSON-LD' },
] as const
