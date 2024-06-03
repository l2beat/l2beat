import { authorsCollection } from './authors'
import { delegatedProjectsCollection } from './delegatedProjects'
import { eventsCollection } from './events'
import { publicationsCollection } from './publications'

export const collections = {
  publications: publicationsCollection,
  delegatedProjects: delegatedProjectsCollection,
  events: eventsCollection,
  authors: authorsCollection,
}
