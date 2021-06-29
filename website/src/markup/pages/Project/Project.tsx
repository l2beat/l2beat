import { Project } from '@l2beat/config'
import { Page } from '../../common/Page'

interface Props {
  project: Project
}

export function Project({ project }: Props) {
  return (
    <Page title={`${project.name} – L2BEAT`}>
      <div>
        <h1>{project.name}</h1>
      </div>
    </Page>
  )
}
