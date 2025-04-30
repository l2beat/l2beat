import type { Metadata } from 'next'
import { getCollection } from '~/content/get-collection'
import { getDefaultMetadata } from '~/utils/metadata'
import { GlossaryPage } from './_page'

export const metadata: Metadata = getDefaultMetadata({
  title: 'Glossary - L2BEAT',
  description: "A glossary of terms for Ethereum's Layer 2 ecosystem",
  openGraph: {
    url: '/glossary',
  },
})

export default function Page() {
  const glossaryEntries = getCollection('glossary')

  return <GlossaryPage glossaryEntries={glossaryEntries} />
}
