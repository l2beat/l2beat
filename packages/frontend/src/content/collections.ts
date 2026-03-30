import { authorsCollection } from './authors'
import { changelogCollection } from './changelog'
import { delegatedProjectsCollection } from './delegated-projects'
import { eventsCollection } from './events'
import { externalPublicationsCollection } from './external-publications'
import { glossaryCollection } from './glossary'
import { governancePublicationsCollection } from './governance-publications'
import { monthlyUpdatesCollection } from './monthly-updates'
import { pagesCollection } from './pages'
import { partnersCollection } from './partners'

export const collections = {
  'governance-publications': governancePublicationsCollection,
  'delegated-projects': delegatedProjectsCollection,
  events: eventsCollection,
  authors: authorsCollection,
  glossary: glossaryCollection,
  changelog: changelogCollection,
  pages: pagesCollection,
  partners: partnersCollection,
  'monthly-updates': monthlyUpdatesCollection,
  'external-publications': externalPublicationsCollection,
}
