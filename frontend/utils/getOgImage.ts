import captureWebsite from 'capture-website'
import { join } from 'path'

export const OG_FILES_DIR = join(process.cwd(), 'out', 'og')

export async function generateImage(project: string) {
  console.log(`Generating: ${project}`)

  return captureWebsite.file(`http://localhost:8080/og/${project}.html`, join(OG_FILES_DIR, `${project}.png`), {
    width: 1200,
    height: 630,
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    } as any,
  })
}
