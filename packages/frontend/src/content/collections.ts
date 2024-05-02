import { authorsCollection } from './authors'
import { delegatedProjectsCollection } from './delegatedProjects'
import { eventsCollection } from './events'
import { glossaryCollection } from './glossary'
import { publicationsCollection } from './publications'
import { zkCatalogDescriptionsCollection } from './zkCatalogDescriptions'

export const collections = {
  publications: publicationsCollection,
  delegatedProjects: delegatedProjectsCollection,
  events: eventsCollection,
  authors: authorsCollection,
  glossary: glossaryCollection,
  zkCatalogDescriptions: zkCatalogDescriptionsCollection,
}
