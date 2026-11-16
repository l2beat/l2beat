import { type ReactElement, StrictMode } from 'react'
import {
  GlossaryContextProvider,
  type LinkGlossaryTerms,
} from '~/components/markdown/GlossaryContext'
import { getPage } from './pageLoaders'
import type { SsrData } from './pageTypes'

/** The whole React tree, shared by the server render and client hydration. */
export async function getPageElement(
  ssrData: SsrData,
  linkTerms: LinkGlossaryTerms,
): Promise<ReactElement> {
  const Page = await getPage(ssrData.page)

  return (
    <StrictMode>
      <GlossaryContextProvider linkTerms={linkTerms}>
        {/* @ts-expect-error TypeScript is not smart enough yet */}
        <Page {...ssrData.props} />
      </GlossaryContextProvider>
    </StrictMode>
  )
}
