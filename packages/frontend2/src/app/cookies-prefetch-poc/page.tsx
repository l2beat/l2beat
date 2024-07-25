import { type Metadata } from 'next'
import { cookies } from 'next/headers'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { CookiesPrefetchPocClientComponent } from './_components/cookies-prefetch-poc-client-component'

export const metadata: Metadata = getDefaultMetadata({
  robots: {
    index: false,
  },
})

export async function Page() {
  const text = cookies().get('cookies-prefetch-poc-text')?.value ?? 'world'
  await api.cookiesPrefetchPoC.prefetch({
    text,
  })

  return (
    <HydrateClient>
      <CookiesPrefetchPocClientComponent initialText={text} />
    </HydrateClient>
  )
}
