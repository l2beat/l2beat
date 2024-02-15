import { PageMetadata } from '../../../Page'
import { GovernancePublicationEntry } from '../../index/props/getGovernancePublicationEntry'

export function getPageMetadata(publication: GovernancePublicationEntry): PageMetadata {
  return {
    title: `${publication.shortTitle ?? publication.title} - L2BEAT`,
    description: publication.description,
    image: `https://l2beat.com/meta-images/governance/publications/${publication.id}.png`,
    url: `https://l2beat.com/governance/publications/${publication.id}`,
  }
}
