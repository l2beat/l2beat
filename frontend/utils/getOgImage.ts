import captureWebsite from 'capture-website'
import memoize from 'lodash/memoize'
import { APP_URL } from './constants'
export function getImage_(project?: string) {
  return captureWebsite.buffer(`${APP_URL}/og/${project || ''}`, { width: 1200, height: 620 })
}
export const getOgImage = memoize(getImage_)
