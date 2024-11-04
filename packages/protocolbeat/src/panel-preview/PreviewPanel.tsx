import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getPreview } from '../api/api'

export function PreviewPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const previewResponse = useQuery({
    queryKey: ['projects', project, 'preview'],
    queryFn: () => getPreview(project),
  })

  const response = previewResponse.data
  if (response === undefined) {
    return <div>Preview unavailable</div>
  }

  return (
    <div className="flex h-full w-full select-none flex-col">
      <div className="flex flex-col gap-1 overflow-x-auto border-b border-b-coffee-600 px-1 pt-1">
        <h2 className="p-2 font-bold text-2xl text-blue-600">Permissions:</h2>
        {response.permissions.map((permission, index) => (
            <div key={index} className="flex flex-col gap-2 p-2">
            <h3 className="font-bold">{permission.name}</h3>
            <div className="text-sm">
              <ul className="list-disc pl-5 italic">
                {permission.addresses.map((address, idx) => (
                  <li key={idx}>{address}</li>
                ))}
              </ul>
            </div>
            {permission.multisigParticipants && (
              <div className="text-sm">
                <div>Participants:</div>
                <ul className="list-disc pl-5 italic">
                  {permission.multisigParticipants.map((address, idx) => (
                    <li key={idx}>{address}</li>
                  ))}
                </ul>
              </div>
            )}
            <p>
              {permission.description.split('\n').map((a) => (
                <div>{a}</div>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
