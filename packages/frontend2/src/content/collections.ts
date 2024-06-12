import { authorsCollection } from './authors'
import { delegatedProjectsCollection } from './delegated-projects'
import { eventsCollection } from './events'
import { glossaryCollection } from './glossary'
import { publicationsCollection } from './publications'

export const collections = {
  publications: publicationsCollection,
  'delegated-projects': delegatedProjectsCollection,
  events: eventsCollection,
  authors: authorsCollection,
  glossary: glossaryCollection,
}
