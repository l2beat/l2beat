import { PageMetadata } from '../../PageMetadata'

export interface TechnologiesPageProps {
  title: string
  metadata: PageMetadata
}

export function getTechnologiesPageProps(): TechnologiesPageProps {
  return {
    title: 'Technologies',
    metadata: {
      title: 'L2BEAT – Technologies',
      description:
        'L2BEAT is a analytics and research website about Ethereum layer 2 scaling.',
      image: 'https://l2beat.com/meta-images/overview.png',
      url: 'https://l2beat.com/technologies/',
    },
  }
}
