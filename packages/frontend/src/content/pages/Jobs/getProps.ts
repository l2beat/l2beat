import { PageMetadata } from '../../PageMetadata'

export interface JobsPageProps {
  title: string
  metadata: PageMetadata
}

export function getProps(): JobsPageProps {
  return {
    title: 'Open positions',
    metadata: {
      title: 'Jobs – L2BEAT',
      description: '',
      image: 'https://l2beat.com/meta-images/overview.png',
      url: 'https://l2beat.com/jobs/',
    },
  }
}
