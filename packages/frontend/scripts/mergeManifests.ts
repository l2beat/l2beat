import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import type { Manifest as ViteManifest } from 'vite'

interface Manifest {
  names: Record<string, string>
  images: Record<string, { src: string; width: number; height: number }>
  imports: Record<string, string[]>
}

const manifestPath = path.join('dist', 'manifest.json')
const viteManifestPath = path.join('dist', 'static', '.vite', 'manifest.json')

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
    },
    images: manifest.images,
    imports: {
      ...manifest.imports,
      ...Object.entries(viteManifest).reduce(
        (acc, [key, value]) => {
          if (value.imports && value.imports.length > 0) {
            acc[`/${key}`] = value.imports.map(
              (imp) => `/static/${viteManifest[imp]?.file}`,
            )
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
