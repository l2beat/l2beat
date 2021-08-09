import { FinancialViewEntry } from './FinancialView'

interface Props {
  project: FinancialViewEntry
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
