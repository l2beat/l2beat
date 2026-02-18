import { useEffect, useState } from 'react'
import { useIsClient } from '~/hooks/useIsClient'
import { cn } from '~/utils/cn'
import { Logo } from '../Logo'
import { JsonTreeNode } from './JsonTreeNode'
import { MetricWithTooltip } from './MetricWithTooltip'
import { getDevToolsMetrics } from './metrics'
import { getSizeMetrics, type SizeMetrics } from './sizeMetrics'

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
  const metrics = sizeMetrics ? getDevToolsMetrics(sizeMetrics) : []

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
