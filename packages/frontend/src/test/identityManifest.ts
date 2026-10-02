import type { Manifest } from '~/utils/Manifest'

/** Serves every asset at its source path, like the dev server does. */
export const identityManifest: Manifest = {
  getUrl: (url) => url,
  getImage: (url) => ({ src: url, width: 1, height: 1 }),
}
