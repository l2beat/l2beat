import { existsSync } from 'fs'
import path from 'path'

export function getArchitectureImage(slug: string) {
  const exists = existsSync(
    path.join(__dirname, `../../static/images/architecture/${slug}.png`),
  )
  return exists ? `/images/architecture/${slug}.png` : undefined
}
