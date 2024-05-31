import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Governance publications - L2BEAT',
  description:
    'Explore publications from L2BEAT Governance, discover the latest insights, analyses, and updates on Layer 2 project governance, curated by our L2BEAT Governance Team',
  openGraph: {
    url: '/governance/publications',
  },
}

export default async function Page() {
  return <>All Publications</>
}
