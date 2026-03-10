import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { getPageElement } from '../pages/getPageElement'

async function main() {
  // biome-ignore lint/style/noNonNullAssertion: It's there
  const root = document.getElementById('root')!
  const pageElement = await getPageElement(window.__SSR_DATA__)

  hydrateRoot(root, <StrictMode>{pageElement}</StrictMode>)
}

void main()
