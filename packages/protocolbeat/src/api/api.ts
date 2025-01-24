import type {
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

export function executeDiscover(
  project: string,
  chain: string,
  devMode: boolean,
): EventSource {
  const params = new URLSearchParams({
    project,
    chain,
    devMode: devMode.toString(),
  })
  return new EventSource(`/api/terminal/discover?${params}`)
}

export function executeMatchFlat(
  project: string,
  address: string,
  against: 'templates' | 'projects',
): EventSource {
  const params = new URLSearchParams({
    project,
    address,
    against,
  })
  return new EventSource(`/api/terminal/match-flat?${params}`)
}
