import { Wrapped } from '../Page'

export function getProps(): Wrapped<undefined> {
  return {
    props: undefined,
    wrapper: {
      metadata: {
        title: 'L2BEAT – Data Availability Risk Framework',
        description: 'L2BEAT – Data Availability Risk Framework',
        image: 'https://l2beat.com/images/announcements/basic.jpg',
        url: 'https://l2beat.com/da-risk/',
      },
      banner: false,
    },
  }
}
