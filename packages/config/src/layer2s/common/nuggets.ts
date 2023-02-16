const BARTEK_TWITTER_THUMBNAIL =
  'https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg'
const LIFI_THUMBNAIL = 'https://li.fi/logo192.png'

const getYoutubeThumbnail = (videoId: string) => {
  return `https://img.youtube.com/vi/${videoId}/0.jpg`
}

export const NUGGETS = {
  BARTEK_TWITTER_THUMBNAIL,
  LIFI_THUMBNAIL,
  getYoutubeThumbnail
}
