import { Bridge, Layer2 } from '@l2beat/config'

export function getTwitterLink(project: Layer2 | Bridge) {
  const twitterSocialMedia = project.display.links.socialMedia?.find((x) =>
    x.includes('twitter'),
  )
  if (!twitterSocialMedia) {
    return
  }
  const twitterAccount = twitterSocialMedia.substring(
    'https://twitter.com/'.length,
  )

  const message = `Hey @${twitterAccount}. Your project overview on @l2beat would benefit from your help.`
  const url = `https://l2beat.com/scaling/projects/${project.display.slug}`

  const options = [
    ['text', encodeURIComponent(message)],
    ['url', encodeURIComponent(url)],
  ]
    .map((x) => `${x[0]}=${x[1]}`)
    .join('&')

  return `https://twitter.com/intent/tweet?${options}`
}
