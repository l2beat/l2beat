import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { assert } from '@l2beat/shared-pure'
import type { Manifest as ViteManifest } from 'vite'

interface Manifest {
  names: Record<string, string>
  images: Record<string, { src: string; width: number; height: number }>
  imports: Record<string, string[]>
}

const manifestPath = path.join('dist', 'manifest.json')
const viteManifestPath = path.join('dist', 'static', '.vite', 'manifest.json')
const stylesheetSource = 'src/styles/globals.css'

function getViteManifest() {
  const viteManifest = readFileSync(viteManifestPath, 'utf-8')
  return JSON.parse(viteManifest) as ViteManifest
}

function getManifest() {
  const manifest = readFileSync(manifestPath, 'utf-8')
  return JSON.parse(manifest) as Manifest
}

export function mergeManifests(
  manifest: Manifest,
  viteManifest: ViteManifest,
): Manifest {
  const stylesheetEntry = viteManifest[stylesheetSource]
  assert(
    stylesheetEntry,
    `Entry ${stylesheetSource} not found in vite manifest`,
  )

  return {
    names: {
      ...manifest.names,
      ...Object.entries(viteManifest).reduce(
        (acc, [key, value]) => {
          acc[`/${key}`] = `/static/${value.file}`
          return acc
        },
        {} as Record<string, string>,
      ),
      '/index.css': `/static/${stylesheetEntry.file}`,
    },
    images: manifest.images,
    imports: {
      ...manifest.imports,
      ...Object.entries(viteManifest).reduce(
        (acc, [key, value]) => {
          if (value.imports && value.imports.length > 0) {
            acc[`/${key}`] = value.imports.map((imp) => {
              const entry = viteManifest[imp]
              assert(entry, `Import ${imp} not found in vite manifest`)
              return `/static/${entry.file}`
            })
          }
          return acc
        },
        {} as Record<string, string[]>,
      ),
    },
  }
}

function main() {
  console.time('Merging manifests')
  const manifest = getManifest()
  const viteManifest = getViteManifest()
  const mergedManifest = mergeManifests(manifest, viteManifest)
  writeFileSync(manifestPath, JSON.stringify(mergedManifest, null, 2))
  console.timeEnd('Merging manifests')
}

main()
