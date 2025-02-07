import type { ProjectJSON } from './types'

interface FormProps {
  data: ProjectJSON
  setData: (data: ProjectJSON) => void
}

export function Form(_: FormProps) {
  return <div>Form</div>
}
