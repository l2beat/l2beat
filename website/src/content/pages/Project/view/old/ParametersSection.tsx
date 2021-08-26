import { ProjectDetails } from '@l2beat/config'
import React from 'react'
import { Section } from '../Section'
import { ProjectParameter } from './ProjectParameter'

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
