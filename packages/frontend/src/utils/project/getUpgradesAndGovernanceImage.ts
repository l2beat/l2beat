import { existsSync } from 'fs'
import path from 'path'

export function getUpgradesAndGovernanceImage(slug: string) {
  const exists = existsSync(
    path.join(
      __dirname,
      `../../static/images/upgrades-and-governance/${slug}.png`,
    ),
  )
  return exists ? `/images/upgrades-and-governance/${slug}.png` : undefined
}
