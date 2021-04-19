import captureWebsite from 'capture-website'
import { join } from 'path'

import { OG_FILES_DIR } from './constants'

export async function generateImage(project: string = '') {
  console.log(`Generating: ${project || 'overview'}`)

  return captureWebsite.file(
    `http://localhost:8080/og/${project}`,
    join(OG_FILES_DIR, `${project || 'overview'}.png`),
    {
      width: 1200,
      height: 630,
      launchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },
  )
}
