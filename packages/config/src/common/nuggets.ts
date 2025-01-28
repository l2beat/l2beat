import type { KnowledgeNugget } from '../types'

const THUMBNAILS = {
  ARBITRUM_01: 'arbitrum-01.jpg',
  ARBITRUM_02: 'arbitrum-02.jpg',
  AZTEC_01: 'aztec-01.jpg',
  AZTEC_02: 'aztec-02.jpg',
  FUEL_01: 'fuel-01.jpg',
  KROMA_01: 'kroma-01.jpg',
  L2BEAT_01: 'l2beat-01.jpg',
  L2BEAT_02: 'l2beat-02.jpg',
  L2BEAT_03: 'l2beat-03.jpg',
  L2BEAT_04: 'l2beat-04.jpg',
  LIFI_01: 'lifi-01.jpg',
  MODULAR_ROLLUP: 'modular-rollup.jpg',
  OPTIMISM_01: 'optimism-01.jpg',
  OPTIMISM_02: 'optimism-02.jpg',
  OPTIMISM_03: 'optimism-03.jpg',
  OPTIMISM_04: 'optimism-04.jpg',
  OPTIMISM_VISION: 'optimism-vision.png',
  STARKWARE_01: 'starkware-01.jpg',
  STARKWARE_02: 'starkware-02.jpg',
  STARKWARE_03: 'starkware-03.jpg',
  STARKWARE_04: 'starkware-04.jpg',
  STARKWARE_05: 'starkware-05.jpg',
  TWITTER_01: 'twitter-01.jpg',
  TWITTER_02: 'twitter-02.jpg',
  VITALIK_01: 'vitalik-01.jpg',
  DEFAULT: 'default.jpg',
}

const STARKWARE: KnowledgeNugget[] = [
  {
    title: 'Understand StarkWare #1',
    url: 'https://twitter.com/bkiepuszewski/status/1480473352213041152',
    thumbnail: THUMBNAILS.STARKWARE_01,
  },
  {
    title: 'Understand StarkWare #2',
    url: 'https://twitter.com/bkiepuszewski/status/1480804584926949377',
    thumbnail: THUMBNAILS.STARKWARE_02,
  },
  {
    title: 'Understand StarkWare #3',
    url: 'https://twitter.com/bkiepuszewski/status/1481173682219270146',
    thumbnail: THUMBNAILS.STARKWARE_03,
  },
  {
    title: 'Understand StarkWare #4',
    url: 'https://twitter.com/bkiepuszewski/status/1481521079562784769',
    thumbnail: THUMBNAILS.STARKWARE_04,
  },
]

export const NUGGETS = {
  THUMBNAILS,
  STARKWARE,
}
