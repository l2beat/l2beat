import { bridges, layer2s, tokenList } from '@l2beat/config'

export type Config = ReturnType<typeof getConfig>
export function getConfig() {
  return {
    links: {
      twitter: 'https://twitter.com/l2beat',
      discord: 'https://discord.gg/eaVKXPmtWk',
      github: 'https://github.com/l2beat/l2beat',
      youTube:
        'https://www.youtube.com/channel/UCDrl-fNXFjOoykr4lQij9BA/videos',
      medium: 'https://medium.com/l2beat',
      forum: 'https://gov.l2beat.com/',
    },
    features: {
      banner: false,
      gitcoinOption: false,
      bridges: false,
      activity: false,
    },
    backend: {
      apiUrl: process.env.API_URL ?? 'https://api.l2beat.com',
      skipCache: !!process.env.SKIP_CACHE,
    },
    layer2s,
    bridges,
    tokens: tokenList,
  }
}
