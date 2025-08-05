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

    rootsRef.current.forEach((root) => {
      root.unmount()
    })
    rootsRef.current = []

    const glossaryLinks = container.querySelectorAll(
      'a[data-link-role="glossary"]',
    )

    glossaryLinks.forEach((link) => {
      const description = link.getAttribute('data-description')
      if (!description) return

      const wrapper = document.createElement('span')
      wrapper.style.display = 'inline'

      // Replace the link with our wrapper
      link.parentNode?.insertBefore(wrapper, link)

      const root = createRoot(wrapper)
      rootsRef.current.push(root)

      const href = link.getAttribute('href') ?? '#'

      root.render(
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <a href={href} data-link-role="glossary">
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
