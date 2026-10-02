import type { ProjectSequencingSpec, TableReadyValue } from '@l2beat/config'
import type { SequencingSectionProps } from '~/components/projects/sections/SequencingSection'
import { CENTRALIZED_SEQUENCING_FIELDS } from '~/components/projects/sections/sequencing/centralizedSequencingFields'
import { getSequencerSetRows } from '~/components/projects/sections/sequencing/sequencerSetFields'
import { configMarkdown } from './configMarkdown'
import {
  heading,
  joinBlocks,
  link,
  table,
  textSubsection,
  withSentiment,
} from './markdown'
import {
  renderDiagram,
  renderReferences,
  renderRisks,
} from './renderSectionParts'

export function renderSequencing(
  props: Omit<SequencingSectionProps, 'title' | 'sectionOrder'>,
  level: number,
) {
  return joinBlocks([
    renderDiagram(props.diagram),
    heading(level, props.name),
    configMarkdown(props.content, level + 1),
    renderSpecSheet(props.sequencingSpec),
    props.inclusionDelay
      ? joinBlocks([
          `The inclusion delay chart is shown on ${link('the HTML page', `#${props.id}`)}.`,
          configMarkdown(props.inclusionDelayChartDescription, level + 1),
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
