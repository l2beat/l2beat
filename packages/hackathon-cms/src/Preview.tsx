import type { BaseProject } from './BaseProject'

interface PreviewProps {
  project: BaseProject
}

export function Preview({project}: PreviewProps) {
  return <div>Preview: {JSON.stringify(project)}</div>
}
