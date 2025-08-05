import { useEffect, useRef } from 'react'
import { tooltipContentVariants } from '../core/tooltip/Tooltip'

interface GlossaryTooltipWrapperProps {
  children: React.ReactNode
}

export function GlossaryTooltipWrapper({
  children,
}: GlossaryTooltipWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to re-run this effect when the children change
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Find all glossary links
    const glossaryLinks = container.querySelectorAll(
      'a[data-link-role="glossary"]',
    )

    const tooltips: (() => void)[] = []

    glossaryLinks.forEach((link) => {
      const description = link.getAttribute('data-description')
      if (!description) return

      let tooltipElement: HTMLDivElement | null = null

      const showTooltip = () => {
        if (tooltipElement) {
          hideTooltip()
        }

        // Create tooltip element
        tooltipElement = document.createElement('div')
        tooltipElement.className = tooltipContentVariants({
          className: 'fixed z-[9999]',
        })
        tooltipElement.textContent = description

        // First append to get real dimensions
        tooltipElement.style.visibility = 'hidden'
        document.body.appendChild(tooltipElement)

        // Get actual dimensions
        const rect = link.getBoundingClientRect()
        const tooltipRect = tooltipElement.getBoundingClientRect()

        // Calculate position - prefer above, fallback to below
        let top = rect.top - tooltipRect.height - 8
        if (top < 10) {
          top = rect.bottom + 8
        }

        let left = rect.left + rect.width / 2 - tooltipRect.width / 2

        // Keep tooltip within viewport
        if (left < 10) left = 10
        if (left + tooltipRect.width > window.innerWidth - 10) {
          left = window.innerWidth - tooltipRect.width - 10
        }

        // Apply final position and make visible
        tooltipElement.style.top = `${top}px`
        tooltipElement.style.left = `${left}px`
        tooltipElement.style.visibility = 'visible'
      }

      const hideTooltip = () => {
        if (tooltipElement) {
          tooltipElement.remove()
          tooltipElement = null
        }
      }

      link.addEventListener('mouseenter', showTooltip)
      link.addEventListener('mouseleave', hideTooltip)

      tooltips.push(() => {
        link.removeEventListener('mouseenter', showTooltip)
        link.removeEventListener('mouseleave', hideTooltip)
        if (tooltipElement) {
          hideTooltip()
        }
      })
    })

    return () => {
      tooltips.forEach((cleanup) => cleanup())
    }
  }, [children])

  return <div ref={containerRef}>{children}</div>
}
