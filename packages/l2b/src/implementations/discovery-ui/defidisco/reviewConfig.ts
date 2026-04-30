import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import { ensureChainPrefix } from './addressUtils'
import type {
  ApiReviewConfigResponse,
  ApiUpdateEntityDescriptionRequest,
  ReviewConfig,
} from './types'

export function getReviewConfig(
  paths: DiscoveryPaths,
  project: string,
): ApiReviewConfigResponse {
  const configPath = getReviewConfigPath(paths, project)

  let config: ReviewConfig | null = null
  if (fs.existsSync(configPath)) {
    try {
      const fileContent = fs.readFileSync(configPath, 'utf8')
      config = JSON.parse(fileContent) as ReviewConfig
      // Backfill defaults for configs created before the merge
      config.version ??= '1.0'
      config.lastModified ??= ''
      // publishedAt was added later — fall back to lastModified so legacy
      // configs have a best-effort publication date.
      config.publishedAt ??= config.lastModified || ''
      config.description ??= ''
      config.admins ??= {}
      config.dependencies ??= {}
      config.funds ??= {}
      // Strip removed sections from old configs
      if (config.sections) {
        const { codeAndAudits } = config.sections as any
        config.sections = {
          codeAndAudits: codeAndAudits ?? {
            title: 'Code & Audits',
            subsections: [],
          },
        }
      }
    } catch (error) {
      console.error('Error parsing review config file:', error)
    }
  }

  return {
    config,
    availableTemplates: ['stablecoin'],
  }
}

export function updateReviewConfig(
  paths: DiscoveryPaths,
  project: string,
  config: ReviewConfig,
): void {
  config.lastModified = new Date().toISOString()
  // Defensively strip resources (now stored in resources.json)
  delete (config as any).resources
  // Defensively strip governance (now stored in governance.json)
  delete (config as any).governance
  writeReviewConfig(paths, project, config)
}

export function updateEntityDescription(
  paths: DiscoveryPaths,
  project: string,
  request: ApiUpdateEntityDescriptionRequest,
): void {
  const { config } = getReviewConfig(paths, project)
  if (!config) {
    throw new Error('No review config exists for this project')
  }

  const normalizedAddress = ensureChainPrefix(request.address)

  const section = config[request.section]

  if (!request.description && !request.name) {
    delete section[normalizedAddress]
  } else {
    section[normalizedAddress] = {
      name: request.name,
      description: request.description,
    }
  }
  config.lastModified = new Date().toISOString()

  writeReviewConfig(paths, project, config)
}

function writeReviewConfig(
  paths: DiscoveryPaths,
  project: string,
  config: ReviewConfig,
): void {
  const configPath = getReviewConfigPath(paths, project)
  const dir = path.dirname(configPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Preserve publishedAt and verified across writes. Both are set out-of-band
  // (publishedAt at first create, verified via the explicit toggle button) and
  // must survive routine edits coming through this chokepoint that don't
  // include the field in their payload (e.g. the description editor).
  // Note: /generate-review bypasses this chokepoint entirely (writes via the
  // Write tool), so the skill itself must also preserve these fields — see
  // generate-review SKILL.md.
  let existing: ReviewConfig | undefined
  if (fs.existsSync(configPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(configPath, 'utf8')) as ReviewConfig
    } catch (_) {
      // ignore parse errors — treat as fresh create
    }
  }

  if (!config.publishedAt) {
    config.publishedAt =
      existing?.publishedAt || config.lastModified || new Date().toISOString()
  }

  // verified === false is a valid intentional value (Unverified), so guard
  // strictly on undefined rather than truthiness.
  if (config.verified === undefined && existing?.verified !== undefined) {
    config.verified = existing.verified
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

function getReviewConfigPath(paths: DiscoveryPaths, project: string): string {
  return path.join(paths.discovery, project, 'review-config.json')
}
