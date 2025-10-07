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
  const replacedLinksRef = useRef<
    {
      wrapper: HTMLElement
      original: HTMLAnchorElement
    }[]
  >([])

  const cleanupRoots = () => {
    // Restore original links first to keep DOM consistent between rerenders
    replacedLinksRef.current.forEach(({ wrapper, original }) => {
      if (wrapper.parentNode) {
        wrapper.replaceWith(original)
      }
    })

    rootsRef.current = []
    replacedLinksRef.current = []
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to re-run this effect when the children change
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    cleanupRoots()

    const glossaryLinks = container.querySelectorAll(
      'a[data-link-role="glossary"]',
    )

    glossaryLinks.forEach((link) => {
      const description = link.getAttribute('data-description')
      const href = link.getAttribute('href') ?? '#'
      if (!description) return

      const wrapper = document.createElement('span')
      wrapper.style.display = 'inline'

      // Replace the link with our wrapper
      link.parentNode?.insertBefore(wrapper, link)
      // Keep a clone of the original link so we can restore it during cleanup
      const original = link.cloneNode(true) as HTMLAnchorElement
      replacedLinksRef.current.push({ wrapper, original })

      const root = createRoot(wrapper)
      rootsRef.current.push(root)

      root.render(
        <TooltipProvider>
          <Tooltip delayDuration={150}>
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

    return cleanupRoots
  }, [children])

  return (
    <div ref={containerRef} className="inline">
      {children}
    </div>
  )
}
