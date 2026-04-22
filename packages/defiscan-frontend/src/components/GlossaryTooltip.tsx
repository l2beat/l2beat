import { useState } from 'react'
import { GLOSSARY } from '../utils/glossary'

interface GlossaryTooltipProps {
  term: string
  children?: React.ReactNode
}

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const [show, setShow] = useState(false)
  const definition = GLOSSARY[term]

  if (!definition) {
    return <span>{children ?? term}</span>
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="cursor-help border-purple-400 border-b border-dotted text-purple-700">
        {children ?? term}
      </span>
      {show && (
        <span className="-translate-x-1/2 pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-72 rounded-lg bg-bg-dark p-3 text-sm text-white leading-relaxed shadow-xl">
          <span className="font-semibold text-purple-300">{term}</span>
          <br />
          {definition}
          <span className="-translate-x-1/2 absolute top-full left-1/2 border-4 border-transparent border-t-bg-dark" />
        </span>
      )}
    </span>
  )
}
