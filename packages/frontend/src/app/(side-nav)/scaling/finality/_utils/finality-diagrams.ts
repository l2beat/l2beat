import { getDiagramParams } from '~/utils/project/get-diagram-params'

export const finalityDiagrams = [
  {
    name: 'State diff\nZK rollups',
    src: {
      dark: {
        desktop: getDiagram('state-diff-zk-dark'),
        mobile: getDiagram('state-diff-zk-dark-mobile'),
      },
      light: {
        desktop: getDiagram('state-diff-zk'),
        mobile: getDiagram('state-diff-zk-mobile'),
      },
    },
  },
  {
    name: 'Transaction data\nOptimistic rollups',
    src: {
      dark: {
        desktop: getDiagram('transaction-data-optimistic-dark'),
        mobile: getDiagram('transaction-data-optimistic-dark-mobile'),
      },
      light: {
        desktop: getDiagram('transaction-data-optimistic'),
        mobile: getDiagram('transaction-data-optimistic-mobile'),
      },
    },
  },
  {
    name: 'Transaction data\nZK rollups',
    src: {
      dark: {
        desktop: getDiagram('transaction-data-zk-dark'),
        mobile: getDiagram('transaction-data-zk-dark-mobile'),
      },
      light: {
        desktop: getDiagram('transaction-data-zk'),
        mobile: getDiagram('transaction-data-zk-mobile'),
      },
    },
  },
]

function getDiagram(diagramName: string) {
  const diagram = getDiagramParams('finality', diagramName)

  if (!diagram) {
    throw new Error(`Diagram not found: ${diagramName}`)
  }

  return diagram.src
}
