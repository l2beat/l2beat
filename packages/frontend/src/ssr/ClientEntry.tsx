import { hydrateRoot } from 'react-dom/client'
import { linkGlossaryTerms } from '~/utils/markdown/glossaryPlugin'
import { getPageElement } from '../pages/getPageElement'
import { getSsrData } from './pageDataScripts'

async function main() {
  // biome-ignore lint/style/noNonNullAssertion: It's there
  const root = document.getElementById('root')!
  const ssrData = getSsrData()
  const pageElement = await getPageElement(
    ssrData,
    linkGlossaryTerms(ssrData.glossaryTerms),
  )

  hydrateRoot(root, pageElement)
}

void main().catch((error) => {
  console.error('[ClientEntry] Failed to hydrate', error)
})
