import { useState } from 'react'
import { Form } from './Form'
import { Preview } from './Preview'
import { jsonToBaseProject } from './jsonToBaseProject'
import type { ProjectJSON } from './types'

export function App() {
  const [data, setData] = useState<ProjectJSON>({})

  const baseProject = jsonToBaseProject(data)

  return (
    <div className="flex h-screen w-screen">
      {/* Left Column: Form */}
      <div className="w-1/2 p-4 border-r overflow-auto">
        <Form data={data} setData={setData} />
      </div>

      {/* Right Column: Preview */}
      <div className="w-1/2 p-4 overflow-auto">
        <Preview project={baseProject} />
      </div>
    </div>
  )
}
