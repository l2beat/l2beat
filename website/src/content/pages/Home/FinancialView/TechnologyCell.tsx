import { FinancialEntry } from '../props'

interface Props {
  project: FinancialEntry
}

export function TechnologyCell({ project }: Props) {
  return (
    <abbr
      className="FinancialView-Technology Tooltip"
      title={project.technology.name}
      data-rollup={
        ['ZKR', 'ORU'].includes(project.technology.abbreviation)
          ? true
          : undefined
      }
    >
      <span>{project.technology.abbreviation}</span>
    </abbr>
  )
}
