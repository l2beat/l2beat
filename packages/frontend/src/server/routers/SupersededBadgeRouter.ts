import express from 'express'
import type { Manifest } from '~/utils/Manifest'

const HASHED_BADGE_PATH =
  /^\/static\/images\/garden\/badges\/([a-z0-9-]+)\.[0-9a-f]{8}\.svg$/

/**
 * Projects link the CROPS badges by their hashed URLs, and every redesign
 * gives a badge a new hash. A hash the build no longer has redirects to the
 * badge's current file, so badges linked before a redesign keep loading.
 * Mounted after the static files, so it only sees hashes that are gone.
 */
export function createSupersededBadgeRouter(manifest: Manifest) {
  const router = express.Router()

  router.get(HASHED_BADGE_PATH, (req, res, next) => {
    const name = req.path.match(HASHED_BADGE_PATH)?.[1]
    const current = name && getCurrentUrl(manifest, name)
    if (!current || current === req.path) return next()
    res.redirect(301, current)
  })

  return router
}

function getCurrentUrl(manifest: Manifest, name: string) {
  try {
    return manifest.getUrl(`/images/garden/badges/${name}.svg`)
  } catch {
    // The badge itself was removed, not redesigned.
    return undefined
  }
}
