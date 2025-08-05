import { useLayoutEffect, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '../core/tooltip/Tooltip'

interface GlossaryTooltipWrapperProps {
  children: React.ReactNode
}

export function GlossaryTooltipWrapper({
  children,
}: GlossaryTooltipWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootsRef = useRef<Root[]>([])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to re-run this effect when the children change
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clean up previous roots
    rootsRef.current.forEach((root) => {
      root.unmount()
    })
    rootsRef.current = []

    // Find all glossary links
    const glossaryLinks = container.querySelectorAll(
      'a[data-link-role="glossary"]',
    )

    glossaryLinks.forEach((link) => {
      const description = link.getAttribute('data-description')
      if (!description) return

      // Create a wrapper element for the tooltip
      const wrapper = document.createElement('span')
      wrapper.style.display = 'inline'

      // Replace the link with our wrapper
      link.parentNode?.insertBefore(wrapper, link)

      // Create React root and render tooltip
      const root = createRoot(wrapper)
      rootsRef.current.push(root)

      // Clean the href by removing the description query parameter
      const originalHref = link.getAttribute('href') || '#'
      const cleanHref = originalHref.split('?description=')[0]

      root.render(
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <a href={cleanHref} data-link-role="glossary">
                {link.textContent}
              </a>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>{description}</TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>,
      )

      // Remove the original link
      link.remove()
    })

    return () => {
      rootsRef.current.forEach((root) => {
        root.unmount()
      })
      rootsRef.current = []
    }
  }, [children])

  return <div ref={containerRef}>{children}</div>
}
