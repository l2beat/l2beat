import { useMemo } from 'react'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { findSection } from '../risk'
import { Section } from '../ui/Section'

/**
 * Value moving between Ethereum and other chains: the existing section,
 * framed like the rest of the page. The frame takes the section's id, so old
 * /projects/ethereum#interop-flows links land on it.
 */
export function Flows({
  order,
  entry,
}: {
  order: number
  entry: EthereumProjectPageEntry
}) {
  const flows = findSection(entry, 'InteropFlowsSection')
  const items = useMemo(
    () =>
      flows
        ? [
            {
              ...flows,
              props: {
                ...flows.props,
                id: 'interop-volume' as const,
                title: 'Between Ethereum and other chains',
              },
            },
          ]
        : [],
    [flows],
  )
  if (items.length === 0) return null

  return (
    <Section
      id="interop-flows"
      order={order}
      title="Volume and flows"
      lede="Value moving between Ethereum and other chains through interop protocols, by chain and by protocol."
    >
      <div className="[&_section]:scroll-mt-4">
        <ProjectDetails items={items} nested parentSection={String(order)} />
      </div>
    </Section>
  )
}
