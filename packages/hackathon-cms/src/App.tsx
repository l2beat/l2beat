import { useState } from 'react'
import { Form } from './Form'
import { Preview } from './Preview'
import { jsonToBaseProject } from './jsonToBaseProject'
import type { ProjectJSON } from './types'

export function App() {
  const [data, setData] = useState<ProjectJSON>({})

  const baseProject = jsonToBaseProject(data)

  return (
    <div className="flex h-full w-full">
      <Form data={data} setData={setData} />
      <Preview project={baseProject} />
    </div>
  )
}
