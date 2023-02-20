import { KnowledgeNugget } from '../../common'

const BARTEK_TWITTER_THUMBNAIL =
  'https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg'
const LIFI_THUMBNAIL = 'https://li.fi/logo192.png'

const getYoutubeThumbnail = (videoId: string) => {
  return `https://img.youtube.com/vi/${videoId}/0.jpg`
}

const STARKEX_NUGGETS: KnowledgeNugget[] = [
  {
    title: 'Understand StarkWare #1',
    url: 'https://twitter.com/bkiepuszewski/status/1480473352213041152',
    thumbnailUrl: BARTEK_TWITTER_THUMBNAIL,
  },
  {
    title: 'Understand StarkWare #2',
    url: 'https://twitter.com/bkiepuszewski/status/1480804584926949377',
    thumbnailUrl: BARTEK_TWITTER_THUMBNAIL,
  },
  {
    title: 'Understand StarkWare #3',
    url: 'https://twitter.com/bkiepuszewski/status/1481173682219270146',
    thumbnailUrl: BARTEK_TWITTER_THUMBNAIL,
  },
  {
    title: 'Understand StarkWare #4',
    url: 'https://twitter.com/bkiepuszewski/status/1481521079562784769',
    thumbnailUrl: BARTEK_TWITTER_THUMBNAIL,
  },
]

export const NUGGETS = {
  BARTEK_TWITTER_THUMBNAIL,
  LIFI_THUMBNAIL,
  getYoutubeThumbnail,
  STARKEX_NUGGETS,
}
