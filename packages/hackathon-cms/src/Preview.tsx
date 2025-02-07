import type { BaseProject } from './BaseProject'

interface PreviewProps {
  project: BaseProject
}

export function Preview(_: PreviewProps) {
  return <div>Preview</div>
}
