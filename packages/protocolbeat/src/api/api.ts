import { withoutUndefinedKeys } from '../utils/withoutUndefinedKeys'
import type {
  ApiCodeResponse,
  ApiCodeSearchResponse,
  ApiConfigFileResponse,
  ApiCreateConfigFileResponse,
  ApiCreateShapeResponse,
  ApiListTemplatesResponse,
  ApiFunctionsResponse,
  ApiFunctionsUpdateRequest,
  ApiContractTagsResponse,
  ApiContractTagsUpdateRequest,
  ApiPreviewResponse,
  ApiProjectResponse,
  ApiProjectsResponse,
  ApiTemplateFileResponse,
  ApiV2ScoreResponse,
  ApiFundsDataResponse,
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

export async function createConfigFile(
  project: string,
  type: 'project' | 'token',
  initialAddresses: string[],
  overwrite: boolean,
  maxDepth?: number,
  maxAddresses?: number,
) {
  const res = await fetch('/api/config-files', {
    method: 'POST',
    body: JSON.stringify({
      project,
      type,
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

export function executeGeneratePermissionsReport(project: string): EventSource {
  const params = new URLSearchParams({
    project,
  })
  return new EventSource(`/api/terminal/generate-permissions-report?${params}`)
}

export async function getFunctions(project: string): Promise<ApiFunctionsResponse> {
  const res = await fetch(`/api/projects/${project}/functions`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiFunctionsResponse
}

export async function updateFunction(
  project: string,
  request: ApiFunctionsUpdateRequest
): Promise<void> {
  const res = await fetch(`/api/projects/${project}/functions`, {
    method: 'PUT',
    body: JSON.stringify(request),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }
}

export async function getContractTags(project: string): Promise<ApiContractTagsResponse> {
  const res = await fetch(`/api/projects/${project}/contract-tags`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiContractTagsResponse
}

export async function updateContractTag(
  project: string,
  request: ApiContractTagsUpdateRequest
): Promise<void> {
  const res = await fetch(`/api/projects/${project}/contract-tags`, {
    method: 'PUT',
    body: JSON.stringify(request),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }
}

export async function detectPermissionsWithAI(
  project: string,
  address: string
): Promise<{ success: boolean; detectedFunctions: number; functions: any[] }> {
  const res = await fetch(`/api/projects/${project}/ai-detect-permissions/${address}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || res.statusText)
  }

  return await res.json()
}

export async function getV2Score(project: string): Promise<ApiV2ScoreResponse> {
  const res = await fetch(`/api/projects/${project}/v2-score`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiV2ScoreResponse
}

export async function getFundsData(project: string): Promise<ApiFundsDataResponse> {
  const res = await fetch(`/api/projects/${project}/funds-data`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return data as ApiFundsDataResponse
}

export function executeFetchFunds(project: string, contractAddress?: string): EventSource {
  // For SSE with POST, we need a workaround since EventSource only supports GET
  // We'll use fetch with a ReadableStream instead, but for simplicity, we'll use a pattern
  // that works with the existing terminal pattern

  // Create an EventSource-like wrapper using fetch
  const url = `/api/projects/${project}/funds-data/fetch`
  const body = contractAddress ? JSON.stringify({ contractAddress }) : JSON.stringify({})

  // Use a custom approach - create a fetch request and return a mock EventSource
  const eventSource = new EventSource('about:blank')

  // Override with actual fetch
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  }).then(async (response) => {
    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = decoder.decode(value)
      const lines = text.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          const event = new MessageEvent('message', { data })
          eventSource.dispatchEvent(event)
        }
      }
    }
  }).catch((error) => {
    const event = new MessageEvent('error', { data: error.message })
    eventSource.dispatchEvent(event)
  })

  return eventSource
}

