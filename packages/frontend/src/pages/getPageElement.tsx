import type { ReactElement } from 'react'
import { getPage } from './pageLoaders'
import type { SsrData } from './pageTypes'

export async function getPageElement(ssrData: SsrData): Promise<ReactElement> {
  const Page = await getPage(ssrData.page)

  // @ts-expect-error TypeScript is not smart enough yet
  return <Page {...ssrData.props} />
}
