import type { PrivacyNoteSource } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { PrivacyNoteEvent, PrivacyRpcLog } from '../types'
import { extractZkApiNoteEvent, ZK_API_NOTE_TOPICS } from '../zkapi/notes'

interface NoteExtractorDefinition {
  /** topic0 of every event that creates a note or changes its eligibility. */
  events: string[]
  extract: (log: PrivacyRpcLog) => PrivacyNoteEvent
}

export function getPrivacyNoteExtractor(
  source: PrivacyNoteSource,
): NoteExtractorDefinition {
  switch (source.extractor) {
    case 'zkApiNote':
      return {
        events: ZK_API_NOTE_TOPICS,
        extract: (log) => extractZkApiNoteEvent(log, source.params.weiPerUnit),
      }
    default:
      assertUnreachable(source.extractor)
  }
}

export function extractPrivacyNoteEvent(
  source: PrivacyNoteSource,
  log: PrivacyRpcLog,
): PrivacyNoteEvent {
  return getPrivacyNoteExtractor(source).extract(log)
}
