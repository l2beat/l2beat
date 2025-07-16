import { useState } from 'react'
import { Markdown } from '~/components/markdown/Markdown'

interface Props {
  children: string
}

export function UpgradeConsiderations({ children }: Props) {
  const [show, setShow] = useState(false)
  return (
    <div className="text-paragraph-15 md:text-paragraph-16">
      <button
        className="mt-2 text-sm underline"
        onClick={() => setShow((show) => !show)}
      >
        Show upgrade details
      </button>
      {/* TODO: remove leading once line heights are fixed for all text on the page */}
      {show ? <Markdown className="mt-2">{children}</Markdown> : null}
    </div>
  )
}
