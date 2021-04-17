import captureWebsite from 'capture-website'
import memoize from 'lodash/memoize'
import { join } from 'path'

import { APP_URL } from './constants'
export function getImage_(project?: string) {
  return captureWebsite.buffer(`${APP_URL}/og/${project || ''}`, { width: 1200, height: 620 })
}

export async function generateImage(project: string = '') {
  return captureWebsite.file(
    `http://localhost:3000/og/${project}`,
    join(process.cwd(), 'public', 'og', `${project || 'overview'}.png`),
    {
      width: 1200,
      height: 620,
      launchOptions: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      }
    })
}
export const getOgImage = memoize(getImage_)

