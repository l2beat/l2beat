import type { ReactElement } from 'react'
import { BadgeLookupProvider } from '~/components/projects/BadgeLookup'
import { getPage } from './pageLoaders'
import type { SsrData } from './pageTypes'

export async function getPageElement(ssrData: SsrData): Promise<ReactElement> {
  const Page = await getPage(ssrData.page)

  return (
    <BadgeLookupProvider badges={ssrData.badges}>
      {/* @ts-expect-error TypeScript is not smart enough yet */}
      <Page {...ssrData.props} />
    </BadgeLookupProvider>
  )
}
