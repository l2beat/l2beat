'use client'
import { useState } from 'react'
import { Markdown } from '~/components/markdown/markdown'

interface Props {
  children: string
}

export function UpgradeConsiderations({ children }: Props) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <button
        className="mt-2 text-sm underline"
        onClick={() => setShow((show) => !show)}
      >
        Show upgrade details
      </button>
      {/* TODO: remove leading once line heights are fixed for all text on the page */}
      {show ? (
        <Markdown className="mt-2 text-sm leading-snug text-gray-850 dark:text-gray-400">
          {children}
        </Markdown>
      ) : null}
    </div>
  )
}
