import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import path from 'path'

const LAYOUTS_DIRECTORY = 'layouts'
const LAYOUT_FILE_EXTENSION = '.json'

type LayoutRecord = Record<string, unknown> & {
  projectId: string
  metadata?: {
    slug?: string
    description?: string
  }
}

export interface LayoutSummary {
  name: string
  description?: string
}

export type LayoutStorageErrorCode =
  | 'already-exists'
  | 'invalid-json'
  | 'invalid-layout'
  | 'invalid-name'
  | 'not-found'
  | 'project-mismatch'

export class LayoutStorageError extends Error {
  constructor(
    readonly code: LayoutStorageErrorCode,
    message: string,
  ) {
    super(message)
  }
}

export function listProjectLayouts(projectPath: string): LayoutSummary[] {
  const layoutsPath = getLayoutsPath(projectPath)
  if (!existsSync(layoutsPath)) {
    return []
  }

  return readdirSync(layoutsPath, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && entry.name.endsWith(LAYOUT_FILE_EXTENSION),
    )
    .map((entry) => entry.name.slice(0, -LAYOUT_FILE_EXTENSION.length))
    .filter((name) => isValidLayoutName(name))
    .map((name) => {
      const description = readLayoutDescription(projectPath, name)
      return { name, description }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function readProjectLayout(projectPath: string, name: string): unknown {
  assertValidLayoutName(name)
  const filePath = getLayoutFilePath(projectPath, name)

  if (!existsSync(filePath)) {
    throw new LayoutStorageError(
      'not-found',
      `Layout "${name}" does not exist.`,
    )
  }

  return parseLayoutFile(filePath)
}

export function writeProjectLayout(args: {
  project: string
  projectPath: string
  name: string
  layout: unknown
  overwrite?: boolean
}): LayoutRecord {
  const name = assertValidLayoutName(args.name)
  const normalized = normalizeLayout(args.layout)
  if (normalized.projectId !== args.project) {
    throw new LayoutStorageError(
      'project-mismatch',
      `Layout projectId "${normalized.projectId}" does not match route project "${args.project}".`,
    )
  }

  const layoutsPath = getLayoutsPath(args.projectPath)
  const filePath = getLayoutFilePath(args.projectPath, name)
  mkdirSync(layoutsPath, { recursive: true })

  if (existsSync(filePath) && !args.overwrite) {
    throw new LayoutStorageError(
      'already-exists',
      `Layout "${name}" already exists.`,
    )
  }

  writeFileSync(filePath, `${JSON.stringify(normalized, null, 2)}\n`)
  return normalized
}

function getLayoutsPath(projectPath: string): string {
  return path.join(projectPath, LAYOUTS_DIRECTORY)
}

function getLayoutFilePath(projectPath: string, name: string): string {
  return path.join(
    getLayoutsPath(projectPath),
    `${name}${LAYOUT_FILE_EXTENSION}`,
  )
}

function isValidLayoutName(name: string): boolean {
  return (
    name.length > 0 &&
    name === name.trim() &&
    name !== '.' &&
    name !== '..' &&
    !/[\\/]/.test(name)
  )
}

function assertValidLayoutName(name: string): string {
  if (!isValidLayoutName(name)) {
    throw new LayoutStorageError(
      'invalid-name',
      'Layout name cannot be empty and cannot contain path separators.',
    )
  }
  return name
}

function readLayoutDescription(
  projectPath: string,
  name: string,
): string | undefined {
  const filePath = getLayoutFilePath(projectPath, name)
  try {
    const parsed = parseLayoutFile(filePath)
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      return undefined
    }
    return normalizeDescription((parsed as LayoutRecord).metadata)
  } catch {
    return undefined
  }
}

function parseLayoutFile(filePath: string): unknown {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as unknown
  } catch {
    throw new LayoutStorageError(
      'invalid-json',
      `Layout file "${path.basename(filePath)}" is not valid JSON.`,
    )
  }
}

function normalizeLayout(layout: unknown): LayoutRecord {
  if (layout === null || typeof layout !== 'object' || Array.isArray(layout)) {
    throw new LayoutStorageError(
      'invalid-layout',
      'Layout payload must be a JSON object.',
    )
  }

  const candidate = layout as Record<string, unknown>
  if (
    typeof candidate.projectId !== 'string' ||
    candidate.projectId.length === 0
  ) {
    throw new LayoutStorageError(
      'invalid-layout',
      'Layout payload must include a string projectId.',
    )
  }

  const description = normalizeDescription(candidate.metadata)
  return {
    ...candidate,
    projectId: candidate.projectId,
    metadata:
      description === undefined
        ? undefined
        : {
            description,
          },
  }
}

function normalizeDescription(metadata: unknown): string | undefined {
  if (metadata === null || typeof metadata !== 'object') {
    return undefined
  }

  const description = (metadata as { description?: unknown }).description
  if (typeof description !== 'string') {
    return undefined
  }

  const trimmed = description.trim()
  return trimmed === '' ? undefined : trimmed
}
