import { existsSync } from 'fs'
import path from 'path'

export function hasArchitectureImage(slug: string) {
  return existsSync(
    path.join(__dirname, `../../static/images/${slug}-architecture.png`),
  )
}
