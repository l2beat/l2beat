import { useEffect } from 'react'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'

export const SECTIONS = [
  { id: 'throughput', label: 'Capacity' },
  { id: 'cost', label: 'Cost' },
  { id: 'interop-flows', label: 'Who relies on it' },
  { id: 'economics', label: 'ETH economics' },
  { id: 'risk-summary', label: 'Risk' },
  { id: 'da-layer-technology', label: 'Technology' },
] as const

/** The page's name, what the console is, and a jump list; digits 1–6 jump without the mouse */
export function Masthead({ entry }: { entry: EthereumProjectPageEntry }) {
  useJumpKeys()
  return (
    <header className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 pt-5 pb-3 md:px-0 md:pt-3">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={entry.icon}
          alt=""
          width={28}
          height={28}
          className="size-7 shrink-0"
        />
        <div className="min-w-0">
          <h1 className="font-bold text-[26px] text-primary leading-none">
            {entry.name}
          </h1>
          <p className="mt-1 text-[13px] text-secondary leading-tight">
            The base layer every system we assess relies on, read live from the
            tip of the chain.
          </p>
        </div>
      </div>
      <nav
        aria-label="Sections"
        className="ml-auto flex flex-wrap items-center gap-1 max-md:hidden"
      >
        {SECTIONS.map((section, i) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] text-secondary hover:bg-surface-primary hover:text-primary"
          >
            <kbd className="rounded-[3px] border border-divider px-1 font-mono text-[10px] leading-4">
              {i + 1}
            </kbd>
            {section.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

function useJumpKeys() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]'))
        return
      const section = SECTIONS[Number(event.key) - 1]
      if (!section) return
      document
        .getElementById(section.id)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', `#${section.id}`)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
