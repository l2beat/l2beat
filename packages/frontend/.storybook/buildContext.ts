import { PageBuildContext } from '../src/build/pageBuildContext'

export const storybookBuildContext: PageBuildContext = {
  config: {
    features: {
      activity: true,
      liveness: true,
      finality: true,
      banner: true,
      tvlBreakdown: true,
      implementationChange: true,
      gitcoinOption: true,
      hiringBadge: true,
      buildAllProjectPages: true,
      governancePage: true,
      costsPage: true,
      zkCatalog: true,
      tvl2: true,
      glossary: true,
      layer3sTvl: true,
    },
    links: {
      twitter: 'test',
      discord: 'test',
      github: 'test',
      linkedin: 'test',
      youTube: 'test',
      medium: 'test',
      forum: 'test',
      multisigReport: 'test',
    },
    backend: {
      apiUrl: '',
      mock: true,
      skipCache: false,
    },
    layer2s: [],
    layer3s: [],
    bridges: [],
    zkCatalogProjects: [],
    milestones: [],
  },
  path: '/',
}
