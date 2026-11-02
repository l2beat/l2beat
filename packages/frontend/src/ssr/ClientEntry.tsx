import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { getPageElement } from '../pages/getPageElement'
import { getSsrData } from './pageDataScripts'

async function main() {
  // biome-ignore lint/style/noNonNullAssertion: It's there
  const root = document.getElementById('root')!
  const pageElement = await getPageElement(getSsrData())

  hydrateRoot(root, <StrictMode>{pageElement}</StrictMode>)
}

void main().catch((error) => {
  console.error('[ClientEntry] Failed to hydrate', error)
})
