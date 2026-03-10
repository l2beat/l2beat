import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

function svgToPngBlob(
  svgElement: SVGSVGElement,
  scale = 2,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement
    const viewBox = svgElement.viewBox.baseVal
    const width = viewBox.width || svgElement.clientWidth
    const height = viewBox.height || svgElement.clientHeight
    svgClone.setAttribute('width', String(width))
    svgClone.setAttribute('height', String(height))
    const bgRect = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    )
    bgRect.setAttribute('width', '100%')
    bgRect.setAttribute('height', '100%')
    bgRect.setAttribute('fill', 'white')
    svgClone.insertBefore(bgRect, svgClone.firstChild)

    const data = new XMLSerializer().serializeToString(svgClone)
    const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        resolve(null)
        return
      }
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      canvas.toBlob(resolve, 'image/png')
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}

interface ShareableDiagramProps {
  /** HTML id for anchor linking */
  id: string
  /** Heading text */
  title: string
  /** Query string to include in the shareable link (e.g. "?view=explorer") */
  linkQuery?: string
  /** Filename for the downloaded PNG fallback */
  downloadName?: string
  /** Additional CSS classes for the outer container */
  className?: string
  /** The SVG diagram to render */
  children: ReactNode
}

export function ShareableDiagram({
  id,
  title,
  linkQuery = '',
  downloadName = 'diagram.png',
  className,
  children,
}: ShareableDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [copyState, setCopyState] = useState<
    'idle' | 'copied-image' | 'copied-link'
  >('idle')

  useEffect(() => {
    if (window.location.hash === `#${id}`) {
      containerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [id])

  const handleCopyImage = useCallback(async () => {
    const svg = containerRef.current?.querySelector('svg')
    if (!svg) return
    const blob = await svgToPngBlob(svg)
    if (!blob) return
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
      setCopyState('copied-image')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = downloadName
      a.click()
      URL.revokeObjectURL(url)
      setCopyState('copied-image')
      setTimeout(() => setCopyState('idle'), 2000)
    }
  }, [downloadName])

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}${linkQuery}#${id}`
    navigator.clipboard.writeText(url)
    setCopyState('copied-link')
    setTimeout(() => setCopyState('idle'), 2000)
  }, [id, linkQuery])

  return (
    <div
      id={id}
      className={`rounded-lg border border-border bg-white p-4${className ? ` ${className}` : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <div className="flex items-center gap-1">
          {copyState !== 'idle' && (
            <span className="text-xs text-status-green mr-1">
              {copyState === 'copied-image' ? 'Image copied!' : 'Link copied!'}
            </span>
          )}
          <button
            onClick={handleCopyImage}
            className="p-1.5 rounded hover:bg-surface-secondary text-text-muted hover:text-text-primary transition-colors"
            title="Copy diagram as image"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded hover:bg-surface-secondary text-text-muted hover:text-text-primary transition-colors"
            title="Copy link to diagram"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </button>
        </div>
      </div>
      <div ref={containerRef}>{children}</div>
    </div>
  )
}
