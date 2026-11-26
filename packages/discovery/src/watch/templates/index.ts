import type { WatchTemplate } from '../WatchTemplate'
import { githubDirectory } from './githubDirectory'

// Keyed by the name watch.jsonc refers to, which must equal the template's own.
export const WATCH_TEMPLATES: Record<string, WatchTemplate> = {
  githubDirectory,
}
