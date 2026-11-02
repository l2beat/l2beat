import { hydrateRoot } from 'react-dom/client'
import { linkGlossaryTerms } from '~/utils/markdown/glossaryPlugin'
import { getPageElement } from '../pages/getPageElement'

async function main() {
  // biome-ignore lint/style/noNonNullAssertion: It's there
  const root = document.getElementById('root')!
  const ssrData = window.__SSR_DATA__
  const pageElement = await getPageElement(
    ssrData,
    linkGlossaryTerms(ssrData.glossaryTerms),
  )

  hydrateRoot(root, pageElement)
}

void main().catch((error) => {
  console.error('[ClientEntry] Failed to hydrate', error)
})
