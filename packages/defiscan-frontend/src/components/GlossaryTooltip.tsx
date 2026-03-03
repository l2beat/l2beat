import { useState } from 'react'
import { GLOSSARY } from '../utils/narrative'

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
      <span className="border-b border-dotted border-purple-400 cursor-help text-purple-700">
        {children ?? term}
      </span>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 rounded-lg bg-bg-dark text-white text-sm p-3 leading-relaxed shadow-xl pointer-events-none">
          <span className="font-semibold text-purple-300">{term}</span>
          <br />
          {definition}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-dark" />
        </span>
      )}
    </span>
  )
}
