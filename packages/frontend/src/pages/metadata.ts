import { PageMetadata } from './Page'

interface Options {
  image: string
  url: string
}

export function getDefaultPageMetadata(opts: Options): PageMetadata {
  return {
    title: 'L2BEAT – The state of the layer two ecosystem',
    description:
      'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you will find in depth comparison of major protocols live on Ethereum today.',
    image: opts.image,
    url: opts.url,
  }
}
