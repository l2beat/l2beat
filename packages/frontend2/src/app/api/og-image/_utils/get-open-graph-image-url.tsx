import { assertUnreachable } from '@l2beat/shared-pure'

type GovernancePublicationTemplate = {
  type: 'governance'
  title: string
}

type Options = GovernancePublicationTemplate

export function getOpenGraphImageUrl(opts: Options) {
  const { type, title } = opts

  switch (type) {
    case 'governance':
      return `/api/og-image?type=${encodeURIComponent(
        type,
      )}&title=${encodeURIComponent(title)}`
    default:
      assertUnreachable(type)
  }
}
