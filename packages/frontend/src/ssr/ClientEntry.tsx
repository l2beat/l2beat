import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { getPageElement } from '../pages/getPageElement'

declare global {
  interface Document {
    /** Missing from TypeScript's DOM types; undefined outside Chromium. */
    readonly prerendering?: boolean
  }
}

async function main() {
  // biome-ignore lint/style/noNonNullAssertion: It's there
  const root = document.getElementById('root')!
  const pageElement = await getPageElement(window.__SSR_DATA__)

  whenShown(() => hydrateRoot(root, <StrictMode>{pageElement}</StrictMode>))
}

/**
 * A prerendered page (see speculationRules) hydrates only once the visitor
 * navigates to it, and after the first frame: hydration is a long task, which
 * would hold back showing the page that is already laid out. It also keeps
 * effects, tRPC queries and "recently viewed" from running for a page that
 * may never be shown.
 */
function whenShown(callback: () => void) {
  if (!document.prerendering) {
    callback()
    return
  }
  const afterFirstFrame = () =>
    requestAnimationFrame(() => setTimeout(callback))
  document.addEventListener('prerenderingchange', afterFirstFrame, {
    once: true,
  })
}

void main().catch((error) => {
  console.error('[ClientEntry] Failed to hydrate', error)
})
