import { useLayoutEffect, useRef, useState } from 'react'

const VIEWPORT_MARGIN_PX = 8
const ANCHOR_GAP_PX = 8

export function Tooltip({
  content,
  children,
}: {
  content: string
  children: React.ReactNode
}) {
  const [anchor, setAnchor] = useState<DOMRect>()
  const [position, setPosition] = useState({ left: 0, top: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!anchor || !tooltipRef.current) {
      return
    }
    setPosition(
      getTooltipPosition(anchor, tooltipRef.current.getBoundingClientRect()),
    )
  }, [anchor])

  return (
    <div
      className="w-fit"
      onMouseEnter={(e) => setAnchor(e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => setAnchor(undefined)}
    >
      {children}
      {anchor && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="fixed z-10 max-w-[calc(100vw-1rem)] rounded-lg bg-gray-700 px-3 py-2 font-medium text-sm text-white shadow-xs"
          style={position}
        >
          {content}
        </div>
      )}
    </div>
  )
}

function getTooltipPosition(anchor: DOMRect, tooltip: DOMRect) {
  const leftCentered = anchor.left + anchor.width / 2 - tooltip.width / 2
  const leftMax = window.innerWidth - tooltip.width - VIEWPORT_MARGIN_PX
  const left = Math.max(VIEWPORT_MARGIN_PX, Math.min(leftCentered, leftMax))

  const topAbove = anchor.top - tooltip.height - ANCHOR_GAP_PX
  const top =
    topAbove >= VIEWPORT_MARGIN_PX ? topAbove : anchor.bottom + ANCHOR_GAP_PX
  return { left, top }
}
