import { withoutUndefinedKeys } from '../common/withoutUndefinedKeys'
import type {
  ApiCodeResponse,
  ApiCodeSearchResponse,
  ApiCreateShapeResponse,
  ApiListTemplatesResponse,
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
    return { entryName: undefined, sources: [] }
  }
  const res = await fetch(`/api/projects/${project}/code/${address}`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiCodeResponse
}

export async function searchCode(
  project: string,
  searchTerm: string,
  address?: string,
): Promise<ApiCodeSearchResponse> {
  const query = new URLSearchParams(
    withoutUndefinedKeys({ searchTerm, address }) as Record<string, string>,
  )

  const url = `/api/projects/${project}/codeSearch?${query.toString()}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiCodeSearchResponse
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

export function executeDownloadAllShapes(): EventSource {
  return new EventSource(`/api/terminal/download-all-shapes`)
}

export async function listTemplates(): Promise<ApiListTemplatesResponse> {
  const res = await fetch('/api/templates')
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiListTemplatesResponse
}

export async function createShape(
  chain: string,
  addresses: string[],
  blockNumber: number,
  templateId: string,
  fileName: string,
) {
  const body = { chain, addresses, blockNumber, templateId, fileName }

  const res = await fetch('/api/templates/create-shape', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data: ApiCreateShapeResponse = await res.json()

  if (!data.success) {
    throw new Error(data.error)
  }
}
