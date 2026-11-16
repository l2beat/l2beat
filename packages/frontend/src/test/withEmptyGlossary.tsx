import type { ReactNode } from 'react'
import { GlossaryContextProvider } from '~/components/markdown/GlossaryContext'
import { linkGlossaryTerms } from '~/utils/markdown/glossaryPlugin'

// `Markdown` needs a glossary, which the SSR and client entries provide.
export function withEmptyGlossary(node: ReactNode) {
  return (
    <GlossaryContextProvider linkTerms={linkGlossaryTerms([])}>
      {node}
    </GlossaryContextProvider>
  )
}
