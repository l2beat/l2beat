import { useParams } from 'react-router-dom'
import { ReviewResourcesEditor } from './ReviewResourcesEditor'

export function ResourcesPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  return (
    <div className="flex h-full w-full flex-col text-sm">
      <div className="sticky top-0 z-10 flex items-center bg-coffee-600 px-2 py-1">
        <span className="font-bold text-autumn-300">Resources</span>
      </div>
      <div className="overflow-auto p-2">
        <ReviewResourcesEditor project={project} />
      </div>
    </div>
  )
}
