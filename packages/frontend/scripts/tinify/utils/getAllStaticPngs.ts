import { readdirSync } from 'fs'
import path from 'path'

export function getAllStaticPngs(directory: string): string[] {
  const files: string[] = []
  const entries = readdirSync(directory, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllStaticPngs(fullPath))
    } else if (entry.name.endsWith('.png')) {
      files.push(fullPath)
    }
  }

  return files
}
