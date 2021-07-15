import { PageMetadata } from '../../PageMetadata'

export interface FaqPageProps {
  title: string
  metadata: PageMetadata
}

export function getFaqPageProps(): FaqPageProps {
  return {
    title: 'Frequently Asked Questions',
    metadata: {
      title: 'L2BEAT – Frequently Asked Questions',
      description:
        'L2BEAT is a analytics and research website about Ethereum layer 2 scaling.',
      image: '/meta-images/overview.png',
      url: 'https://l2beat.com/faq/',
    },
  }
}
