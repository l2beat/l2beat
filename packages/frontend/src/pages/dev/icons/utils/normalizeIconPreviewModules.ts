import type { ComponentType } from 'react'
import type { IconPreviewModule } from './getIconPreviewEntries'

const ICONS_PATH = '/src/icons/'

export type IconPreviewCategory = (typeof ICON_PREVIEW_CATEGORIES)[number]
export const ICON_PREVIEW_CATEGORIES = [
  'Core',
  'Pages',
  'Products',
  'Providers',
] as const

export interface IconPreviewEntry {
  category: IconPreviewCategory
  exportName: string
  sourcePath: string
  Component: ComponentType<Record<string, unknown>>
}

export function normalizeIconPreviewModules(
  modules: Record<string, IconPreviewModule>,
): IconPreviewEntry[] {
  return Object.entries(modules)
    .flatMap(([modulePath, moduleExports]) => {
      const sourcePath = toSourcePath(modulePath)

      return Object.entries(moduleExports)
        .filter(([exportName, value]) => isIconExport(exportName, value))
        .map(([exportName, value]) => ({
          category: toCategory(sourcePath),
          exportName,
          sourcePath,
          Component: value as ComponentType<Record<string, unknown>>,
        }))
    })
    .sort(compareIconPreviewEntries)
}

function isIconExport(exportName: string, value: unknown) {
  return /^[A-Z]/.test(exportName) && typeof value === 'function'
}

function toSourcePath(modulePath: string) {
  return modulePath.slice(ICONS_PATH.length)
}

function toCategory(sourcePath: string): IconPreviewCategory {
  const [segment] = sourcePath.split('/')

  if (segment === sourcePath) {
    return 'Core'
  }

  if (segment === 'pages') {
    return 'Pages'
  }

  if (segment === 'products') {
    return 'Products'
  }

  if (segment === 'providers') {
    return 'Providers'
  }

  return 'Core'
}

function compareIconPreviewEntries(
  a: Pick<IconPreviewEntry, 'category' | 'sourcePath' | 'exportName'>,
  b: Pick<IconPreviewEntry, 'category' | 'sourcePath' | 'exportName'>,
) {
  const categoryPriority =
    ICON_PREVIEW_CATEGORIES.indexOf(a.category) -
    ICON_PREVIEW_CATEGORIES.indexOf(b.category)

  if (categoryPriority !== 0) {
    return categoryPriority
  }

  const pathComparison = a.sourcePath.localeCompare(b.sourcePath)
  if (pathComparison !== 0) {
    return pathComparison
  }

  return a.exportName.localeCompare(b.exportName)
}
