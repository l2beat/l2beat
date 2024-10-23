import { useParams } from 'react-router-dom'
import { MultiView } from './multi-view/MultiView'
import { Panel } from './panels/Panel'

export function ProjectPage() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Missing project!')
  }

  return <MultiView project={project} panelBodyElement={Panel} />
}
