import { authorsCollection } from './authors'
import { delegatedProjectsCollection } from './delegatedProjects'
import { eventsCollection } from './events'
import { publicationsCollection } from './publications'
import { zkCatalogDescriptionsCollection } from './zkCatalogDescriptions'

export const collections = {
  publications: publicationsCollection,
  delegatedProjects: delegatedProjectsCollection,
  events: eventsCollection,
  authors: authorsCollection,
  zkCatalogDescriptions: zkCatalogDescriptionsCollection,
}
