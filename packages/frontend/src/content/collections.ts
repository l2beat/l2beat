import { authorsCollection } from './authors'
import { delegatedProjectsCollection } from './delegated-projects'
import { eventsCollection } from './events'
import { glossaryCollection } from './glossary'
import { monthlyReportsCollection } from './monthly-reports'
import { pagesCollection } from './pages'
import { partnersCollection } from './partners'
import { publicationsCollection } from './publications'
import { zkCatalogDescriptionsCollection } from './zk-catalog-descriptions'

export const collections = {
  publications: publicationsCollection,
  'delegated-projects': delegatedProjectsCollection,
  events: eventsCollection,
  authors: authorsCollection,
  glossary: glossaryCollection,
  'zk-catalog-descriptions': zkCatalogDescriptionsCollection,
  pages: pagesCollection,
  partners: partnersCollection,
  'monthly-reports': monthlyReportsCollection,
}
