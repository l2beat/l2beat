import type { ProjectSequencingSpec, TableReadyValue } from '@l2beat/config'
import type { SequencingSectionProps } from '~/components/projects/sections/SequencingSection'
import { CENTRALIZED_SEQUENCING_FIELDS } from '~/components/projects/sections/sequencing/centralizedSequencingFields'
import { getSequencerSetRows } from '~/components/projects/sections/sequencing/sequencerSetFields'
import {
  heading,
  joinBlocks,
  link,
  nestHeadings,
  table,
  textSubsection,
  withSentiment,
} from './markdown'
import type { SectionContext } from './renderProjectSection'
import {
  renderDiagram,
  renderReferences,
  renderRisks,
} from './renderSectionParts'

export function renderSequencing(
  props: Omit<SequencingSectionProps, 'title' | 'sectionOrder'>,
  level: number,
  context: SectionContext,
) {
  return joinBlocks([
    renderDiagram(props.diagram, context.pageUrl),
    heading(level, props.name),
    nestHeadings(props.content, level + 1),
    renderSpecSheet(props.sequencingSpec),
    props.inclusionDelay
      ? joinBlocks([
          `The inclusion delay chart is shown on ${link('the HTML page', `${context.pageUrl}#${props.id}`)}.`,
          nestHeadings(props.inclusionDelayChartDescription, level + 1),
        ])
      : '',
    textSubsection(
      level + 1,
      'Censorship resistance',
      props.censorshipResistance,
    ),
    renderRisks(props.risks ?? []),
    renderReferences(props.references ?? []),
  ])
}

/** The HTML shows each description as a tooltip on the value; here it gets its own column. */
function renderSpecSheet(spec: ProjectSequencingSpec | undefined) {
  if (!spec) return ''
  const [title, rows] =
    spec.type === 'centralized'
      ? [
          'Centralized sequencing spec sheet',
          CENTRALIZED_SEQUENCING_FIELDS.map(({ key, label }) => ({
            label,
            value: spec[key],
          })),
        ]
      : ['Sequencer set spec sheet', getSequencerSetRows(spec)]
  return joinBlocks([
    `**${title}**`,
    table(
      ['Property', 'Value', 'Description'],
      rows.map(({ label, value }) => [
        label,
        formatSpecValue(value),
        value?.description ?? '',
      ]),
    ),
  ])
}

function formatSpecValue(value: TableReadyValue | undefined) {
  if (!value) return 'Not specified'
  const secondLine = value.secondLine ? `, ${value.secondLine}` : ''
  return withSentiment(`${value.value}${secondLine}`, value.sentiment)
}
