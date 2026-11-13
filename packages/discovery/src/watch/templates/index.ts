import type { WatchTemplate } from '../WatchTemplate'
import { ossificationLeads } from './ossificationLeads'

// Keyed by the name watch.jsonc refers to, which must equal the template's own.
export const WATCH_TEMPLATES: Record<string, WatchTemplate> = {
  ossificationLeads,
}
