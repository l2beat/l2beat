import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { GlossaryContextProvider } from '~/components/markdown/GlossaryContext'
import { linkGlossaryTerms } from '~/utils/markdown/glossaryPlugin'
import { getPageElement } from '../pages/getPageElement'

async function main() {
  // biome-ignore lint/style/noNonNullAssertion: It's there
  const root = document.getElementById('root')!
  const pageElement = await getPageElement(window.__SSR_DATA__)
  const linkTerms = linkGlossaryTerms(window.__SSR_DATA__.glossaryTerms)

  hydrateRoot(
    root,
    <StrictMode>
      <GlossaryContextProvider linkTerms={linkTerms}>
        {pageElement}
      </GlossaryContextProvider>
    </StrictMode>,
  )
}

void main().catch((error) => {
  console.error('[ClientEntry] Failed to hydrate', error)
})
