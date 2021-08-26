import { ProjectDetails } from '@l2beat/config'
import { ProjectParameter } from './ProjectParameter'
import { Section } from '../Section'

interface Props {
  details: ProjectDetails
}

export function ParametersSection({ details }: Props) {
  return (
    <Section title="Technology" id="parameters">
      <ul className="OldProjectDetails-Parameters">
        <ProjectParameter
          name="Technology:"
          value={details.technologyName}
          tooltip={details.technologyDetails}
        />
        {details.parameters.map((param, i) => (
          <ProjectParameter key={i} {...param} />
        ))}
      </ul>
    </Section>
  )
}
