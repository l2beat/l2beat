import fs from 'fs'
import path from 'path'
import { imageSize } from 'image-size'

export interface ManifestJson {
  names: Record<string, string>
  images: Record<string, { src: string; width: number; height: number }>
}

export interface Manifest {
  getUrl(url: string): string
  getImage(url: string): { src: string; width: number; height: number }
}

// I know its weird to have this rewrite specific code in the next frontend.
// However it needs to be imported on next fe side and keeping it in /rewrite makes it
// impossible to import on next fe side cuz /rewrite is CommonJS module.
export function getManifest(isProduction: boolean, rootDir: string) {
  if (isProduction) {
    const content = fs.readFileSync('rewrite/dist/manifest.json', 'utf-8')
    const json = JSON.parse(content) as ManifestJson
    return {
      getUrl(url: string) {
        const resolved = json.names[url]
        if (!resolved) {
          throw Error(`Trying to access non existing file in manifest: ${url}`)
        }
        return resolved
      },
      getImage(url: string) {
        const resolved = json.images[url]
        if (!resolved) {
          throw Error(`Trying to access non existing image in manifest: ${url}`)
        }
        return resolved
      },
    }
  } else {
    return {
      getUrl(url: string) {
        return url
      },
      getImage(url: string) {
        const content = fs.readFileSync(path.join(rootDir, 'static', url))
        const dimensions = imageSize(content)
        return {
          src: url,
          width: dimensions.width,
          height: dimensions.height,
        }
      },
    }
  }
}
