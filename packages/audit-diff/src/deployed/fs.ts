import { lstatSync, readdirSync, readFileSync } from 'fs'
import path from 'path'

export function walk(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir).sort()) {
    const full = path.join(dir, name)
    const stat = lstatSync(full)
    // Symlinks are skipped: archives may contain dangling links.
    if (stat.isSymbolicLink()) continue
    if (stat.isDirectory()) out.push(...walk(full))
    else if (stat.isFile()) out.push(full)
  }
  return out
}

export function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T
}
