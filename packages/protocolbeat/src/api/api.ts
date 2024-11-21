import {
  ApiCodeResponse,
  ApiPreviewResponse,
  ApiProjectResponse,
  ApiProjectsResponse,
} from './types'

export async function getProjects(): Promise<ApiProjectsResponse> {
  const res = await fetch('/api/projects')
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiProjectsResponse
}

export async function getProject(project: string): Promise<ApiProjectResponse> {
  const res = await fetch(`/api/projects/${project}`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiProjectResponse
}

export async function getCode(
  project: string,
  address: string | undefined,
): Promise<ApiCodeResponse> {
  if (!address) {
    return { sources: [] }
  }
  const res = await fetch(`/api/projects/${project}/code/${address}`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiCodeResponse
}

export async function getPreview(project: string): Promise<ApiPreviewResponse> {
  const res = await fetch(`/api/projects/${project}/preview`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiPreviewResponse
}

export function executeCommand(
  command: string,
  project: string,
  chain: string,
): EventSource {
  const params = new URLSearchParams({ command, project, chain })
  return new EventSource(`/api/terminal/execute?${params}`)
}
