import { withoutUndefinedKeys } from '../utils/withoutUndefinedKeys'
import type {
  ApiCodeResponse,
  ApiCodeSearchResponse,
  ApiConfigFileResponse,
  ApiConfigHealthResponse,
  ApiConfigSyncStatusResponse,
  ApiCreateConfigFileResponse,
  ApiCreateShapeResponse,
  ApiDiffHistoryResponse,
  ApiHandlersResponse,
  ApiListTemplatesResponse,
  ApiPreviewResponse,
  ApiProjectLayoutResponse,
  ApiProjectLayoutsResponse,
  ApiProjectResponse,
  ApiProjectsResponse,
  ApiTemplateFileResponse,
} from './types'

export async function getProjects(): Promise<ApiProjectsResponse> {
  const res = await fetch('/api/projects')
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiProjectsResponse
}

export async function getProject(
  project: string,
  maxDepth?: number,
): Promise<ApiProjectResponse> {
  const params = new URLSearchParams()
  if (maxDepth !== undefined) {
    params.set('maxDepth', String(maxDepth))
  }
  const qs = params.toString()
  const res = await fetch(`/api/projects/${project}${qs ? `?${qs}` : ''}`)
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
  devMode: boolean,
): EventSource {
  const params = new URLSearchParams({
    project,
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
  return new EventSource('/api/terminal/download-all-shapes')
}

export async function listTemplates(): Promise<ApiListTemplatesResponse> {
  const res = await fetch('/api/templates')
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiListTemplatesResponse
}

export async function readTemplateFile(
  templateId?: string,
): Promise<ApiTemplateFileResponse> {
  if (!templateId) {
    return { template: '', shapes: undefined, criteria: undefined }
  }

  const res = await fetch(
    `/api/template-files?templateId=${encodeURIComponent(templateId)}`,
  )
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()

  return data as ApiTemplateFileResponse
}

export async function readConfigFile(
  project?: string,
): Promise<ApiConfigFileResponse> {
  if (!project) {
    return { config: '' }
  }

  const res = await fetch(`/api/config-files/${project}`)

  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()

  return data as ApiConfigFileResponse
}

export async function getDiffHistory(
  project: string,
  offset: number,
  limit: number,
): Promise<ApiDiffHistoryResponse> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  })
  const res = await fetch(`/api/projects/${project}/diff-history?${params}`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiDiffHistoryResponse
}

export async function listProjectLayouts(
  project: string,
): Promise<ApiProjectLayoutsResponse> {
  const res = await fetch(`/api/projects/${project}/layouts`)
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
  const data = await res.json()
  return data as ApiProjectLayoutsResponse
}

export async function getProjectLayout(
  project: string,
  name: string,
): Promise<ApiProjectLayoutResponse> {
  const res = await fetch(
    `/api/projects/${project}/layouts/${encodeURIComponent(name)}`,
  )
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
  const data = await res.json()
  return data as ApiProjectLayoutResponse
}

export async function saveProjectLayout(
  project: string,
  name: string,
  layout: unknown,
  overwrite = false,
): Promise<ApiProjectLayoutResponse> {
  const res = await fetch(
    `/api/projects/${project}/layouts/${encodeURIComponent(name)}`,
    {
      method: 'PUT',
      body: JSON.stringify({ layout, overwrite }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }

  const data = await res.json()
  return data as ApiProjectLayoutResponse
}

export async function getConfigSyncStatus(
  project: string,
): Promise<ApiConfigSyncStatusResponse> {
  const res = await fetch(`/api/config/sync-status/${project}`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiConfigSyncStatusResponse
}

export async function getConfigHealth(): Promise<ApiConfigHealthResponse> {
  const res = await fetch('/api/config/health')
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiConfigHealthResponse
}

export async function createConfigFile(
  project: string,
  initialAddresses: string[],
  overwrite: boolean,
  maxDepth?: number,
  maxAddresses?: number,
) {
  const res = await fetch('/api/config-files', {
    method: 'POST',
    body: JSON.stringify({
      project,
      initialAddresses,
      overwrite,
      maxDepth,
      maxAddresses,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data: ApiCreateConfigFileResponse = await res.json()

  if (!data.success) {
    throw new Error(data.error)
  }
}

export async function updateConfigFile(project: string, content: string) {
  const res = await fetch(`/api/config-files/${project}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }
}

export async function writeTemplateFile(templateId: string, content: string) {
  const res = await fetch('/api/template-files', {
    method: 'POST',
    body: JSON.stringify({ templateId, content }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }
}

export async function getHandlers(): Promise<ApiHandlersResponse> {
  const res = await fetch('/api/handlers')
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiHandlersResponse
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

export async function getFlatSource(
  address: string,
): Promise<{ name: string; sources: Record<string, string> }> {
  const res = await fetch(`/api/flat-sources/${address.toLowerCase()}`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as { name: string; sources: Record<string, string> }
}

export function executeFindMinters(address: string): EventSource {
  const params = new URLSearchParams({
    address,
  })
  return new EventSource(`/api/terminal/find-minters?${params}`)
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string; errors?: string }
    return data.error ?? data.errors ?? res.statusText
  } catch {
    return res.statusText
  }
}
