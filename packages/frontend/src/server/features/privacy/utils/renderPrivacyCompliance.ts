import type { PrivacyCompliance, PrivacyNoCompliance } from '@l2beat/config'
import {
  PRIVACY_COMPLIANCE_CONSEQUENCES,
  PRIVACY_COMPLIANCE_GATEKEEPERS,
  type PRIVACY_COMPLIANCE_HEADINGS,
  PRIVACY_COMPLIANCE_RULES,
  PRIVACY_COMPLIANCE_TIMINGS,
  PRIVACY_NO_COMPLIANCE,
  PRIVACY_VOLUNTARY_DISCLOSURES,
} from '@l2beat/config/build/common/privacyCompliance'
import upperFirst from 'lodash/upperFirst'
import { bulletList, heading, joinBlocks } from '~/server/markdown/markdown'

type Part = (typeof PRIVACY_COMPLIANCE_HEADINGS)[number]

/**
 * The compliance section as markdown: the design tradeoff, then two parts
 * every project shares, so that pages compare part by part. Each part opens
 * with its typed facts, and the project's prose for it follows. A project
 * without a compliance design gets one line that says so.
 */
export function renderPrivacyCompliance(
  compliance: PrivacyCompliance | PrivacyNoCompliance,
): string {
  if ('none' in compliance) {
    return `**${upperFirst(PRIVACY_NO_COMPLIANCE)}.** ${compliance.none}`
  }
  const { gatekeeper, rules, timing, consequence, voluntaryDisclosure } =
    compliance
  const prose = splitByHeading(compliance.content)
  const part = (title: Part, facts: string) =>
    joinBlocks([heading(3, title), facts, prose.get(title) ?? ''])

  const gatekeeperLabel = PRIVACY_COMPLIANCE_GATEKEEPERS[gatekeeper.type]
  const enforcement = [
    `**Gatekeeper:** ${gatekeeper.detail ? `${gatekeeperLabel}, ${gatekeeper.detail}` : gatekeeperLabel}.`,
    `**Rules:** ${fact(PRIVACY_COMPLIANCE_RULES[rules.type], rules.detail)}`,
    timing &&
      `**Timing:** ${fact(PRIVACY_COMPLIANCE_TIMINGS[timing.type], timing.detail)}`,
    consequence &&
      `**Consequence:** ${fact(PRIVACY_COMPLIANCE_CONSEQUENCES[consequence.type], consequence.detail)}`,
  ].filter((line) => line !== undefined)

  return joinBlocks([
    compliance.tradeoff,
    part('Enforcement', bulletList(enforcement)),
    part(
      'Voluntary disclosure',
      `**${upperFirst(PRIVACY_VOLUNTARY_DISCLOSURES[voluntaryDisclosure.type])}.** ${voluntaryDisclosure.detail}`,
    ),
  ])
}

/** "label. detail": the shared label of a fact type, then the project's own words. */
function fact(label: string, detail?: string) {
  return detail ? `${label}. ${detail}` : `${label}.`
}

/** The project's prose per `###` heading. */
function splitByHeading(content: string) {
  const prose = new Map<string, string>()
  for (const section of content.split(/^### /m).slice(1)) {
    const [title = '', ...body] = section.split('\n')
    prose.set(title.trim(), body.join('\n').trim())
  }
  return prose
}
