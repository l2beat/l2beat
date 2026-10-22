import {
  AnalyzerResultApiResponse,
  AnalyzersApiResponse,
  withoutUndefinedKeys,
} from '@l2beat/shared-pure'
import type {
  ApiAddressUsageResponse,
  ApiCodeResponse,
  ApiCodeSearchResponse,
  ApiConfigFileResponse,
  ApiConfigHealthResponse,
  ApiConfigSyncStatusResponse,
  ApiCreateConfigFileResponse,
  ApiCreateShapeResponse,
  ApiDefinitionResponse,
  ApiDiffHistoryResponse,
  ApiHandlersResponse,
  ApiListTemplatesResponse,
  ApiPreviewResponse,
  ApiProjectLayoutResponse,
  ApiProjectLayoutsResponse,
  ApiProjectResponse,
  ApiProjectsResponse,
  ApiReferencesResponse,
  ApiTemplateFileResponse,
  ApiTvlResponse,
} from './types'

export function getProjects(): Promise<ApiProjectsResponse> {
  return fetchJson('/api/projects')
}

export function getAddressUsage(): Promise<ApiAddressUsageResponse> {
  return fetchJson('/api/address-usage')
}

export function getProject(
  project: string,
  maxDepth?: number,
): Promise<ApiProjectResponse> {
  const params = new URLSearchParams()
  if (maxDepth !== undefined) {
    params.set('maxDepth', String(maxDepth))
  }
  const qs = params.toString()
  return fetchJson(`/api/projects/${project}${qs ? `?${qs}` : ''}`)
}

export async function getCode(
  project: string,
  address: string | undefined,
): Promise<ApiCodeResponse> {
  if (!address) {
    return { entryName: undefined, sources: [] }
  }
  return await fetchJson(`/api/projects/${project}/code/${address}`)
}

export function getDefinition(
  project: string,
  address: string,
  sourceIndex: number,
  offset: number,
): Promise<ApiDefinitionResponse> {
  const query = new URLSearchParams({
    address,
    source: sourceIndex.toString(),
    offset: offset.toString(),
  })
  return fetchJson(`/api/projects/${project}/definition?${query}`)
}

export function getReferences(
  project: string,
  address: string,
  sourceIndex: number,
  offset: number,
): Promise<ApiReferencesResponse> {
  const query = new URLSearchParams({
    address,
    source: sourceIndex.toString(),
    offset: offset.toString(),
  })
  return fetchJson(`/api/projects/${project}/references?${query}`)
}

export function searchCode(
  project: string,
  searchTerm: string,
  address?: string,
): Promise<ApiCodeSearchResponse> {
  const query = new URLSearchParams(
    withoutUndefinedKeys({ searchTerm, address }) as Record<string, string>,
  )
  return fetchJson(`/api/projects/${project}/codeSearch?${query.toString()}`)
}

export function getPreview(project: string): Promise<ApiPreviewResponse> {
  return fetchJson(`/api/projects/${project}/preview`)
}

// `top` bounds the sweep to that many tokens by market cap, so valuing many
// addresses at once stays affordable.
export function getTvl(
  address: string,
  top?: number,
  signal?: AbortSignal,
): Promise<ApiTvlResponse> {
  const params = new URLSearchParams()
  if (top !== undefined) {
    params.set('top', String(top))
  }
  const qs = params.toString()
  return fetchJson(`/api/projects/tvl/${address}${qs ? `?${qs}` : ''}`, {
    signal,
  })
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

export function listTemplates(): Promise<ApiListTemplatesResponse> {
  return fetchJson('/api/templates')
}

export async function readTemplateFile(
  templateId?: string,
): Promise<ApiTemplateFileResponse> {
  if (!templateId) {
    return { template: '', shapes: undefined, criteria: undefined }
  }
  return await fetchJson(
    `/api/template-files?templateId=${encodeURIComponent(templateId)}`,
  )
}

export async function readConfigFile(
  project?: string,
): Promise<ApiConfigFileResponse> {
  if (!project) {
    return { config: '' }
  }
  return await fetchJson(`/api/config-files/${project}`)
}

export function getDiffHistory(
  project: string,
  offset: number,
  limit: number,
): Promise<ApiDiffHistoryResponse> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  })
  return fetchJson(`/api/projects/${project}/diff-history?${params}`)
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
    jsonRequest('PUT', { layout, overwrite }),
  )
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
  const data = await res.json()
  return data as ApiProjectLayoutResponse
}

export function getConfigSyncStatus(
  project: string,
): Promise<ApiConfigSyncStatusResponse> {
  return fetchJson(`/api/config/sync-status/${project}`)
}

export function getConfigHealth(): Promise<ApiConfigHealthResponse> {
  return fetchJson('/api/config/health')
}

export async function createConfigFile(
  project: string,
  initialAddresses: string[],
  overwrite: boolean,
  maxDepth?: number,
  maxAddresses?: number,
) {
  const res = await fetch(
    '/api/config-files',
    jsonRequest('POST', {
      project,
      initialAddresses,
      overwrite,
      maxDepth,
      maxAddresses,
    }),
  )
  const data: ApiCreateConfigFileResponse = await res.json()
  if (!data.success) {
    throw new Error(data.error)
  }
}

export async function updateConfigFile(project: string, content: string) {
  await fetchOk(`/api/config-files/${project}`, jsonRequest('PUT', { content }))
}

export async function writeTemplateFile(templateId: string, content: string) {
  await fetchOk(
    '/api/template-files',
    jsonRequest('POST', { templateId, content }),
  )
}

export function getHandlers(): Promise<ApiHandlersResponse> {
  return fetchJson('/api/handlers')
}

export async function getAnalyzers(): Promise<AnalyzersApiResponse> {
  const res = await fetch('/api/analyze/analyzers')
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
  const data = await res.json()
  return AnalyzersApiResponse.parse(data)
}

export async function runAnalyzer(
  project: string,
  address: string,
  analyzerId: string,
  entrypoint: string,
): Promise<AnalyzerResultApiResponse> {
  const res = await fetch(
    `/api/projects/${project}/analyze/${address}`,
    jsonRequest('POST', { analyzerId, entrypoint }),
  )
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
  const data = await res.json()
  return AnalyzerResultApiResponse.parse(data)
}

export async function createShape(
  chain: string,
  addresses: string[],
  blockNumber: number,
  templateId: string,
  fileName: string,
) {
  const res = await fetch(
    '/api/templates/create-shape',
    jsonRequest('POST', {
      chain,
      addresses,
      blockNumber,
      templateId,
      fileName,
    }),
  )
  const data: ApiCreateShapeResponse = await res.json()
  if (!data.success) {
    throw new Error(data.error)
  }
}

export function getFlatSource(
  address: string,
): Promise<{ name: string; sources: Record<string, string> }> {
  return fetchJson(`/api/flat-sources/${address.toLowerCase()}`)
}

export function executeFindMinters(address: string): EventSource {
  const params = new URLSearchParams({
    address,
  })
  return new EventSource(`/api/terminal/find-minters?${params}`)
}

export async function updateModuleEntrypoints(
  module: string,
  change: { create: boolean; remove: string[] },
) {
  const res = await fetch(
    `/api/modules/${module}/entrypoints`,
    jsonRequest('POST', change),
  )
  if (!res.ok) {
    throw new Error('Module entrypoints update failed', {
      cause: { status: res.status, error: await readErrorMessage(res) },
    })
  }
}

export function getModules(): Promise<string[]> {
  return fetchJson('/api/modules')
}

export function getStaleModuleConsumers(): Promise<string[]> {
  return fetchJson('/api/modules/stale-consumers')
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetchOk(url, init)
  return (await res.json()) as T
}

async function fetchOk(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, init)
  if (!res.ok) {
    throw new Error('HTTP error', { cause: { url, status: res.status } })
  }
  return res
}

function jsonRequest(method: 'POST' | 'PUT', body: unknown): RequestInit {
  return {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  }
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as {
      error?: string
      errors?: string
      message?: string
    }
    return data.error ?? data.errors ?? data.message ?? res.statusText
  } catch {
    return res.statusText
  }
}
