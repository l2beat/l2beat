import type { PrivacyCompliance } from '@l2beat/config'
import {
  PRIVACY_CLEAN_ORIGIN_TOOLS,
  PRIVACY_COMPLIANCE_COSTS,
  type PRIVACY_COMPLIANCE_HEADINGS,
  PRIVACY_COMPLIANCE_LAYERS,
  PRIVACY_COMPLIANCE_RULES,
  PRIVACY_COMPLIANCE_TIMINGS,
} from '@l2beat/config/build/common/privacyCompliance'
import upperFirst from 'lodash/upperFirst'
import { bulletList, heading, joinBlocks } from '~/server/markdown/markdown'

type Part = (typeof PRIVACY_COMPLIANCE_HEADINGS)[number]

/**
 * The compliance section as markdown: the one-sentence summary, then three
 * parts every project shares, so that pages compare part by part. Each part
 * opens with its typed facts, and config's prose for it follows.
 */
export function renderPrivacyCompliance(compliance: PrivacyCompliance): string {
  const { cost, cleanOrigin } = compliance
  const prose = splitParts(compliance.content)
  const layer = PRIVACY_COMPLIANCE_LAYERS[compliance.enforcedBy]
  const enforcement: [string, string | undefined][] = [
    [
      'Gatekeeper',
      `${compliance.enforcedByNote ? `${layer}, ${compliance.enforcedByNote}` : layer}.`,
    ],
    [
      'Rules',
      `${PRIVACY_COMPLIANCE_RULES[compliance.check.rules]}. ${compliance.check.detail}`,
    ],
    [
      'Timing',
      compliance.when &&
        [`${PRIVACY_COMPLIANCE_TIMINGS[compliance.when]}.`, compliance.whenNote]
          .filter(Boolean)
          .join(' '),
    ],
    [
      'Consequence',
      cost && `${PRIVACY_COMPLIANCE_COSTS[cost.loses]}. ${cost.detail}`,
    ],
  ]
  const part = (title: Part, facts: string) =>
    joinBlocks([heading(3, title), facts, prose.get(title) ?? ''])

  return joinBlocks([
    compliance.short,
    part(
      'Enforcement',
      bulletList(
        enforcement.flatMap(([label, value]) =>
          value ? [`**${label}:** ${value}`] : [],
        ),
      ),
    ),
    part('Data access', lead(compliance.disclosure ?? 'nobody')),
    cleanOrigin
      ? part(
          'Proof of clean origin',
          `${lead(PRIVACY_CLEAN_ORIGIN_TOOLS[cleanOrigin.tool])} ${cleanOrigin.detail}`,
        )
      : '',
  ])
}

/** The fact a part opens with, set apart from the prose after it. */
function lead(fact: string) {
  return `**${upperFirst(fact)}.**`
}

/** Config's prose per heading. */
function splitParts(content: string) {
  const parts = new Map<string, string>()
  for (const section of content.split(/^### /m).slice(1)) {
    const [title, ...body] = section.split('\n')
    if (title) parts.set(title.trim(), body.join('\n').trim())
  }
  return parts
}
