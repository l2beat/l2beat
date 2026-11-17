import { assert } from '@l2beat/shared-pure'
import { hydrateRoot } from 'react-dom/client'
import { linkGlossaryTerms } from '~/utils/markdown/glossaryPlugin'
import { watchThemeChanges } from '~/utils/theme'
import { getPageElement } from '../pages/getPageElement'
import { getSsrData } from './pageDataScripts'

async function main() {
  const root = document.getElementById('root')
  assert(root !== null, 'Root element missing')
  const ssrData = getSsrData()
  const pageElement = await getPageElement(
    ssrData,
    linkGlossaryTerms(ssrData.glossaryTerms),
  )

  hydrateRoot(root, pageElement)
  watchThemeChanges()
}

void main().catch((error) => {
  console.error('[ClientEntry] Failed to hydrate', error)
})
