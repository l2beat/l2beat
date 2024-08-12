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
      hiringBadge: false,
      buildAllProjectPages: true,
      tvl: true,
      badges: true,
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
    milestones: [],
  },
  path: '/',
}
